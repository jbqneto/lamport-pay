import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fillWithZero(num: number | string, size: number): string {
  return fillText('' + num, '0', size);
}

export function fillText(text: string, fill: string, size: number): string {
  if (text.length >= size) {
    return text.slice(0, size);
  }

  return String(text).padStart(size, fill).slice(0, size);
}

export function generateRandomInvoiceId(): string {
  return fillWithZero(Math.floor(Math.random() * 1000000), 6);
}