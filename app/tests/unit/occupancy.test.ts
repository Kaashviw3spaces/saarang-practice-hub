import assert from "node:assert";
import { evaluateOccupancyState } from "../../lib/occupancy/stateEngine";

console.log("▶ Running Unit Test: evaluateOccupancyState");

// Test 1: Checked-in active session -> occupied
{
  const res = evaluateOccupancyState({
    hasActiveBooking: true,
    isCheckedIn: true,
    isOverdue: false,
    sensorPresenceDetected: true,
  });
  assert.strictEqual(res.status, "occupied");
  assert.strictEqual(res.confidence, 1.0);
}

// Test 2: Blueprint Requirement - Booking expired with no checkout & offline sensor must NOT default to vacant!
{
  const res = evaluateOccupancyState({
    hasActiveBooking: true,
    isCheckedIn: true,
    isOverdue: true,
    sensorPresenceDetected: null, // sensor missing/offline
  });
  assert.strictEqual(res.status, "occupancy_uncertain", "Unconfirmed expiry must flag occupancy_uncertain rather than available");
}

// Test 3: Overdue booking + sensor verified vacant -> departure_pending
{
  const res = evaluateOccupancyState({
    hasActiveBooking: true,
    isCheckedIn: true,
    isOverdue: true,
    sensorPresenceDetected: false,
  });
  assert.strictEqual(res.status, "departure_pending", "Sensor vacancy triggers departure_pending grace period");
}

console.log("✅ All Occupancy State Engine unit tests passed!");
