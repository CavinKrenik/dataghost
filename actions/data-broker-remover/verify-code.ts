'use server';

import crypto from 'crypto';
import { getDataBrokerUser, upsertDataBrokerUser } from '@/lib/db';
import { VerifyCodeResponse } from '@/lib/data-broker-remover/types';

export async function verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
  try {
    // Hash email to match storage
    const hash = crypto.createHash('sha256');
    hash.update(email);
    const hashedEmail = hash.digest('hex');

    // Get stored code from Supabase
    const user = await getDataBrokerUser(hashedEmail);

    if (!user || !user.verification_code) {
      return {
        success: false,
        error: 'Verification code not found. Please request a new code.',
      };
    }

    // Verify the code matches
    // NOTE: In production we should also check code_generated_at for expiration (30 mins)
    // For now we match existing behavior + simplified check
    if (user.verification_code !== code) {
      return {
        success: false,
        error: 'Invalid verification code. Please try again.',
      };
    }

    // Mark as verified in Supabase
    await upsertDataBrokerUser({
      id: hashedEmail,
      verified: true
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
