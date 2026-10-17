import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a Date object to a human-readable time string e.g. "4:30 PM" */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Format a Date to "Sat, Oct 17" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Add minutes to a Date */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/** Remaining minutes from now until end */
export function minutesUntil(end: Date): number {
  return Math.max(0, Math.floor((end.getTime() - Date.now()) / 60_000));
}

