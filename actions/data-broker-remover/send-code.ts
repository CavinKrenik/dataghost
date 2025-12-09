'use server';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { getDataBrokerUser, upsertDataBrokerUser } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email-sending';
import { SendCodeResponse } from '@/lib/data-broker-remover/types';
export async function sendVerificationCode(email: string): Promise<SendCodeResponse> {
  try {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const hash = crypto.createHash('sha256');
    hash.update(email);
    const hashedEmail = hash.digest('hex');
    const existingUser = await getDataBrokerUser(hashedEmail);

    // --- SECURITY FIX START: Rate Limiting ---
    if (existingUser) {
      const now = dayjs();

      // Check 1: 45-day cooldown (Existing logic)
      if (existingUser.last_sent_at) {
        const lastSentDate = dayjs(existingUser.last_sent_at);
        const daysSinceLastSent = now.diff(lastSentDate, 'day');
        if (daysSinceLastSent < 45) {
          const daysRemaining = 45 - daysSinceLastSent;
          return {
            success: false,
            error: `You've already used this tool within the last 45 days. Please try again in ${daysRemaining} days.`,
          };
        }
      }

      // Check 2: 60-second OTP cooldown (New logic)
      if (existingUser.code_generated_at) {
        const lastCodeGen = dayjs(existingUser.code_generated_at);
        const secondsSinceGen = now.diff(lastCodeGen, 'second');
        if (secondsSinceGen < 60) {
          return {
            success: false,
            error: `Please wait ${60 - secondsSinceGen} seconds before requesting a new code.`,
          };
        }
      }
    }
    // --- SECURITY FIX END ---
    await upsertDataBrokerUser({
      id: hashedEmail,
      verification_code: otpCode,
      code_generated_at: new Date().toISOString()
    });
    await sendVerificationEmail(email, otpCode);
    return { success: true };
  } catch (error) {

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
