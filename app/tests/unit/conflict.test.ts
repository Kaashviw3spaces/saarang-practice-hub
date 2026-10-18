import assert from "node:assert";
import { hasTimeOverlap, findConflictingBookings } from "../../lib/booking/conflict";

console.log("▶ Running Unit Test: hasTimeOverlap");

// Test 1: Exact overlap
{
  const startA = new Date("2026-10-18T14:00:00Z");
  const endA = new Date("2026-10-18T15:00:00Z");
  const startB = new Date("2026-10-18T14:30:00Z");
  const endB = new Date("2026-10-18T15:30:00Z");
  assert.strictEqual(hasTimeOverlap(startA, endA, startB, endB), true, "Should detect overlapping slots");
}

// Test 2: Consecutive slots (end time equals next start time -> NO overlap)
{
  const startA = new Date("2026-10-18T14:00:00Z");
  const endA = new Date("2026-10-18T15:00:00Z");
  const startB = new Date("2026-10-18T15:00:00Z");
  const endB = new Date("2026-10-18T16:00:00Z");
  assert.strictEqual(hasTimeOverlap(startA, endA, startB, endB), false, "Back-to-back sessions must not overlap");
}

// Test 3: Completely disjoint slots
{
  const startA = new Date("2026-10-18T10:00:00Z");
  const endA = new Date("2026-10-18T11:00:00Z");
  const startB = new Date("2026-10-18T14:00:00Z");
  const endB = new Date("2026-10-18T15:00:00Z");
  assert.strictEqual(hasTimeOverlap(startA, endA, startB, endB), false, "Disjoint sessions must not overlap");
}

console.log("▶ Running Unit Test: findConflictingBookings");
{
  const targetStart = new Date("2026-10-18T14:00:00Z");
  const targetEnd = new Date("2026-10-18T15:00:00Z");

  const existing = [
    { startsAt: new Date("2026-10-18T14:30:00Z"), endsAt: new Date("2026-10-18T15:30:00Z"), status: "confirmed" },
    { startsAt: new Date("2026-10-18T14:15:00Z"), endsAt: new Date("2026-10-18T14:45:00Z"), status: "cancelled" }, // cancelled should be ignored
    { startsAt: new Date("2026-10-18T16:00:00Z"), endsAt: new Date("2026-10-18T17:00:00Z"), status: "confirmed" },
  ];

  const conflicts = findConflictingBookings(targetStart, targetEnd, existing);
  assert.strictEqual(conflicts.length, 1, "Only active confirmed overlapping booking should conflict");
}

console.log("✅ All Booking Conflict Engine unit tests passed!");

