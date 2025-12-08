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
export const US_ONLY_BROKERS = ['Cowen'];
