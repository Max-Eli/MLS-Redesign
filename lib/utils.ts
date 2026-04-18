import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '…'
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

export const BOOK_NOW_URL =
  'https://manhattanlaser.zenoti.com/webstoreNew/services/7f30b4bd-0182-4a65-9633-7d0d039374d6?merchantId=7f30b4bd-0182-4a65-9633-7d0d039374d6&booking_source=booknow&booking_medium=google&rwg_token=AFd1xnGjaW7JiACQMKXlimxv8jQLWfy94bsaPdWs9KREfL2ddcpcZyDEyjgnMROkl-zHtOsXlDuUheVpHwuRiqyiTM3P9-3bQw%3D%3D'
