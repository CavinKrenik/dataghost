import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BROKER_NAMES } from './broker-list';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DataBroker {
  name: string;
  email: string;
  subject?: string;
}

// In the old implementation, this was parsed from ENV.
// For now, we will map the hardcoded BROKER_NAMES to the email format if they were in env.
// However, looking at the previous SETUP-GUIDE, it seems the intention was to load from env.
// The user prompt says: "pass ... the filtered companies list".
// So the caller is responsible for constructing this list.
// But we still need a way to get the full list of brokers to filter from.
// The "BROKER_NAMES" in broker-list.ts is just a list of names for UI.
// The actual emails were in VITE_COMPANIES env var.
// We need to preserve that or find where the emails are.
// Wait, the user prompt says: "Update whatever function calls the email sending to use this new function (pass ... companies list)".
// But where do we get the companies list?
// The old code: `const brokers = getBrokerList();` from `aws-clients.ts` which read `process.env.VITE_COMPANIES`.
// So we should keep `getBrokerList` reading from env or move that data to code if we want to remove the reliance on that specific env var format, but the prompt says: "Environment variables (already exist in Netlify...)"
// So I will just reimplement `getBrokerList` here to read `process.env.VITE_COMPANIES` same as before, but without AWS stuff.

export function getBrokerList(): DataBroker[] {
  try {
    // In Next.js server context, we can require the JSON file directly.
    // This file is included in the build.
    const allBrokers = require('@/data/brokers.json');

    return allBrokers
      .filter((b: any) => b.type === 'email' && b.email)
      .map((b: any) => ({ name: b.name, email: b.email, subject: b.subject }));
  } catch (error) {
    console.error('Failed to load brokers.json:', error);
    return [];
  }
}

// Brokers that only apply to US residents
export const US_ONLY_BROKERS = ['Cowen'];