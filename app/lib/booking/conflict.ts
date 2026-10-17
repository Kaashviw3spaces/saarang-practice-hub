/**
 * Check if two time intervals overlap: [startA, endA) and [startB, endB)
 */
export function hasTimeOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Filter an array of existing bookings to find those that conflict with a target time window.
 */
export function findConflictingBookings<T extends { startsAt: Date; endsAt: Date; status: string }>(
  targetStart: Date,
  targetEnd: Date,
  existingBookings: T[]
): T[] {
  return existingBookings.filter((booking) => {
    // Cancelled bookings do not cause conflict
    if (booking.status === "cancelled") return false;
    return hasTimeOverlap(targetStart, targetEnd, booking.startsAt, booking.endsAt);
  });
}

