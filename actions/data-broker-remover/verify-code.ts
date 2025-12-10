'use server';
import crypto from 'crypto';
import { getDataBrokerUser, upsertDataBrokerUser } from '@/lib/db.server';
import { VerifyCodeResponse } from '@/lib/data-broker-remover/types';
export async function verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
  try {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    const hashedEmail = hash.digest('hex');
    const user = await getDataBrokerUser(hashedEmail);
    if (!user || !user.verification_code) {
      return {
        success: false,
        error: 'Verification code not found. Please request a new code.',
      };
    }
    if (user.verification_code !== code) {
      return {
        success: false,
        error: 'Invalid verification code. Please try again.',
      };
    }
    await upsertDataBrokerUser({
      id: hashedEmail,
      verified: true
    });
    return { success: true };
  } catch (error) {

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
