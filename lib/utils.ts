import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, format: "short" | "medium" | "long" = "medium") {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  switch (format) {
    case "short":
      return dateObj.toLocaleDateString()
    case "long":
      return dateObj.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    default:
      return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
  }
}

export function formatTime(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn
  const checkOutDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut
  
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
