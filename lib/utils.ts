import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

/**
 * Pre-discount price for a product whose stored `price` is already discounted
 * by `discountPercent` (0–100). 20% off a 800 price was 1000, not 960.
 */
export function getOriginalPrice(price: number, discountPercent: number) {
   if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) return price
   return Math.round(price / (1 - discountPercent / 100))
}
