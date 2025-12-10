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
// Fallback to local JSON if dynamic fetch fails
export function getBrokerList(): DataBroker[] {
  try {
    const allBrokers = require('@/data/brokers.json');
    return allBrokers
      .filter((b: any) => b.type === 'email' && b.email)
      .map((b: any) => ({ name: b.name, email: b.email, subject: b.subject }));
  } catch (error) {
    return [];
  }
}

/**
 * Fetches dynamic broker capabilities from the Worker.
 * Prioritizes Worker response, falls back to local JSON on failure.
 */
export async function fetchBrokerCapabilities(): Promise<DataBroker[]> {
  const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080';

  try {
    const response = await fetch(`${WORKER_URL}/capabilities`, {
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
      method: 'GET',
      headers: {
        // If the worker requires auth for capabilities, add header here. 
        // Assuming public or same-network access for now.
        // 'Authorization': \`Bearer \${process.env.CRON_SECRET}\`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from worker');
    }

    const data = await response.json();

    // Transform worker data to application format
    // Assuming worker returns similar shape or we map it
    if (Array.isArray(data)) {
      return data
        .filter((b: any) => b.type === 'email' && b.email)
        .map((b: any) => ({
          name: b.name,
          email: b.email,
          subject: b.subject || 'Data Removal Request'
        }));
    }

    return getBrokerList(); // Fallback if data shape is unexpected

  } catch (error) {
    console.warn('Falling back to static broker list:', error instanceof Error ? error.message : 'Unknown error');
    return getBrokerList();
  }
}
export const US_ONLY_BROKERS = ['Cowen'];
