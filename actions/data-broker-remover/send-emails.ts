"use server";
import crypto from "crypto";
import dayjs from "dayjs";
import { getDataBrokerUser, upsertDataBrokerUser } from "@/lib/db";
import {
  getBrokerList,
  US_ONLY_BROKERS,
} from "@/lib/data-broker-remover/utils";
import { sendOptOutEmails } from "@/lib/email-sending";
import {
  SendEmailsResponse,
  UserDetails,
} from "@/lib/data-broker-remover/types";
export async function sendEmails(
  email: string,
  details: UserDetails,
): Promise<SendEmailsResponse> {
  try {
    const hash = crypto.createHash("sha256");
    hash.update(email);
    const hashedEmail = hash.digest("hex");
    const user = await getDataBrokerUser(hashedEmail);
    if (!user) {
      return {
        success: false,
        error: "Email not found. Please start over.",
      };
    }
    if (!user.verified) {
      return {
        success: false,
        error: "Email not verified. Please verify your email first.",
      };
    }
    if (user.last_sent_at) {
      const lastSentDate = dayjs(user.last_sent_at);
      const now = dayjs();
      const daysSinceLastSent = now.diff(lastSentDate, "day");
      if (daysSinceLastSent < 45) {
        const daysRemaining = 45 - daysSinceLastSent;
        return {
          success: false,
          error: `You have already used this tool within the last 45 days. Please try again in ${daysRemaining} days.`,
        };
      }
    }
    let brokers = getBrokerList();
    if (details.country !== "US") {
      brokers = brokers.filter(
        (broker) => !US_ONLY_BROKERS.includes(broker.name),
      );
    }
    if (brokers.length === 0) {
      return {
        success: false,
        error: "No broker email addresses configured. Please contact support.",
      };
    }
    const companies = brokers.map(broker => ({
      name: broker.name,
      email: broker.email,
      subject: "Data Removal Request",
      body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Address: ${details.street}, {{city}}, ${details.postcode}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`
    }));
    await sendOptOutEmails({
      fullName: details.name,
      city: details.city,
      state: details.country,
      ageRange: "N/A",
      userEmail: email,
      companies: companies
    });
    await upsertDataBrokerUser({
      id: hashedEmail,
      last_sent_at: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {

    return {
      success: false,
      error: "Failed to send emails. Please try again or contact support.",
    };
  }
}
