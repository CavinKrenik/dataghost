'use server';

import crypto from 'crypto';
import dayjs from 'dayjs';
import { getDataBrokerUser, upsertDataBrokerUser } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email-sending';
import { SendCodeResponse } from '@/lib/data-broker-remover/types';

export async function sendVerificationCode(email: string): Promise<SendCodeResponse> {
  try {
    // Generate OTP code
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Hash email for storage
    const hash = crypto.createHash('sha256');
    hash.update(email);
    const hashedEmail = hash.digest('hex');

    // Check existing user
    const existingUser = await getDataBrokerUser(hashedEmail);

    // Check if already sent within 45 days
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

    // Store email hash and OTP in Supabase
    await upsertDataBrokerUser({
      id: hashedEmail,
      verification_code: otpCode,
      code_generated_at: new Date().toISOString()
    });

    // Send verification email via Resend
    await sendVerificationEmail(email, otpCode);

    return { success: true };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
