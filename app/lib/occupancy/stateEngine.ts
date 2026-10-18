import { RoomStatus } from "@/types";

export interface OccupancyStateInput {
  hasActiveBooking: boolean;
  isCheckedIn: boolean;
  isOverdue: boolean;
  sensorPresenceDetected: boolean | null; // null if sensor is offline / unavailable
}

/**
 * State machine calculating session-space occupancy state based on software check-ins,
 * session time status, and hardware sensor confidence.
 *
 * Blueprint requirement: Never treat a session space as vacant solely because a booking
 * has expired or a user missed checkout. Flag as 'occupancy_uncertain' if signals conflict.
 */
export function evaluateOccupancyState(input: OccupancyStateInput): {
  status: RoomStatus;
  confidence: number;
  reason: string;
} {
  const { hasActiveBooking, isCheckedIn, isOverdue, sensorPresenceDetected } = input;

  // 1. Valid active session with checked-in musician
  if (hasActiveBooking && isCheckedIn && !isOverdue) {
    return {
      status: "occupied",
      confidence: 1.0,
      reason: "Musician confirmed physical presence via QR check-in.",
    };
  }

  // 2. Booking time has expired, but no check-out was recorded
  if (isOverdue && isCheckedIn) {
    if (sensorPresenceDetected === false) {
      return {
        status: "departure_pending",
        confidence: 0.85,
        reason: "Scheduled time elapsed and presence sensor detects no movement. Vacancy verification pending grace period.",
      };
    }

    if (sensorPresenceDetected === true) {
      return {
        status: "occupied",
        confidence: 0.9,
        reason: "Session duration elapsed but physical presence is still active.",
      };
    }

    // When sensor is absent or readings conflict, flag as uncertain
    return {
      status: "occupancy_uncertain",
      confidence: 0.5,
      reason: "Scheduled session ended without check-out; hardware presence sensor unconfirmed.",
    };
  }

  // 3. Session space is booked, but musician has not checked in yet
  if (hasActiveBooking && !isCheckedIn) {
    if (sensorPresenceDetected === true) {
      return {
        status: "occupancy_uncertain",
        confidence: 0.6,
        reason: "Unscheduled presence detected prior to member QR check-in.",
      };
    }

    return {
      status: "reserved",
      confidence: 1.0,
      reason: "Reserved session awaiting QR check-in at the entrance.",
    };
  }

  // 4. No booking on schedule
  if (sensorPresenceDetected === true) {
    return {
      status: "occupancy_uncertain",
      confidence: 0.4,
      reason: "Session space is not reserved on schedule, but occupancy sensor reports active movement.",
    };
  }

  return {
    status: "available",
    confidence: 1.0,
    reason: "No active bookings and area is verified vacant.",
  };
}
