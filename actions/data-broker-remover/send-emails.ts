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
    // Hash email to match storage
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

    // Check if verified
    if (!user.verified) {
      return {
        success: false,
        error: "Email not verified. Please verify your email first.",
      };
    }

    // Check if already sent within 45 days
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

    // Get broker list and filter based on country
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

    // Prepare company list
    const companies = brokers.map(broker => ({
      name: broker.name,
      email: broker.email,
      subject: "Data Removal Request",
      body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Address: ${details.street}, {{city}}, ${details.postcode}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`
    }));

    // Send emails
    await sendOptOutEmails({
      fullName: details.name,
      city: details.city,
      state: details.country,
      ageRange: "N/A",
      userEmail: email,
      companies: companies
    });

    // Update lastSent timestamp in Supabase
    await upsertDataBrokerUser({
      id: hashedEmail,
      last_sent_at: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending emails:", error);
    return {
      success: false,
      error: "Failed to send emails. Please try again or contact support.",
    };
  }
}
