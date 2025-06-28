import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to check if running in development mode
export function isDev(): boolean {
  return import.meta.env.DEV || process.env.NODE_ENV === 'development';
}

// Helper function to log only in development
export function devLog(...args: any[]): void {
  if (isDev()) {
    console.log(...args);
  }
}

// Helper function to safely parse JSON with a fallback
export function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return fallback;
  }
}

// Helper function to safely stringify JSON
export function safeJsonStringify(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error('Failed to stringify data:', e);
    return '{}';
  }
}

// Helper function to format currency (INR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper function to format percentage
export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}