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
    if (existingUser && existingUser.last_sent_at) {
      const lastSentDate = dayjs(existingUser.last_sent_at);
      const now = dayjs();
      const daysSinceLastSent = now.diff(lastSentDate, 'day');
      if (daysSinceLastSent < 45) {
        const daysRemaining = 45 - daysSinceLastSent;
        return {
          success: false,
          error: `You've already used this tool within the last 45 days. Please try again in ${daysRemaining} days.`,
        };
      }
    }
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
