import { NextResponse } from "next/server";
import { bookingFormSchema } from "@/lib/validation/booking";
import { findConflictingBookings } from "@/lib/booking/conflict";

// In-memory mock store for demo/development until Supabase live credentials are provided
interface StoredBooking {
  id: string;
  roomId: string;
  userId: string;
  instrument: string;
  mode: "individual" | "collaborative" | "band_rehearsal";
  startsAt: Date;
  endsAt: Date;
  status: "confirmed" | "cancelled";
}

const bookingsStore: StoredBooking[] = [
  {
    id: "existing-1",
    roomId: "11111111-1111-1111-1111-111111111111",
    userId: "mock-user",
    instrument: "Drums",
    mode: "individual",
    startsAt: new Date("2026-10-18T14:00:00Z"),
    endsAt: new Date("2026-10-18T15:00:00Z"),
    status: "confirmed",
  },
];

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = bookingFormSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { roomId, instrument, mode, date, startTime, durationMinutes } = result.data;

    // Construct start and end dates
    const startsAt = new Date(`${date}T${startTime}:00Z`);
    const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

    // Look for conflicts in the selected session
    const roomBookings = bookingsStore.filter((b) => b.roomId === roomId);
    const conflicts = findConflictingBookings(startsAt, endsAt, roomBookings);

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: "Time slot conflict",
          message: "The requested time slot overlaps with an existing reservation in this session.",
        },
        { status: 409 }
      );
    }

    // Create booking record
    const newBooking: StoredBooking = {
      id: crypto.randomUUID(),
      roomId,
      userId: "mock-member",
      instrument,
      mode,
      startsAt,
      endsAt,
      status: "confirmed",
    };

    bookingsStore.push(newBooking);

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
