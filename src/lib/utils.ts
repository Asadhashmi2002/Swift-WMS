import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateToken(): string {
  return Math.random().toString(36).substr(2, 32);
}

export function formatPhoneNumber(phone: string): string {
  // Simple phone number formatting
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  return `+${cleaned}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function saveWizardProgress(data: any): void {
  sessionStorage.setItem('wizard-progress', JSON.stringify(data));
}

export function loadWizardProgress(): any {
  const saved = sessionStorage.getItem('wizard-progress');
  return saved ? JSON.parse(saved) : null;
}

export function clearWizardProgress(): void {
  sessionStorage.removeItem('wizard-progress');
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}