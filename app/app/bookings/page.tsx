import Link from "next/link";
import { Plus } from "lucide-react";
import { BookingCard } from "@/components/bookings/BookingCard";
import { type Booking } from "@/types";

const NOW = new Date();

const ALL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    roomId: "r1",
    roomName: "Studio A",
    userId: "u1",
    memberName: "You",
    instrument: "Electric Guitar",
    mode: "collaborative",
    startsAt: new Date(NOW.getTime() + 60 * 60_000),
    endsAt:   new Date(NOW.getTime() + 120 * 60_000),
    status: "confirmed",
    compatibilityLevel: "compatible",
    compatibilityNote: "Compatible with the acoustic drum session already booked.",
  },
  {
    id: "b2",
    roomId: "r3",
    roomName: "Jam Room",
    userId: "u1",
    memberName: "You",
    instrument: "Bass Guitar",
    mode: "band_rehearsal",
    startsAt: new Date(NOW.getTime() + 2 * 24 * 60 * 60_000),
    endsAt:   new Date(NOW.getTime() + 2 * 24 * 60 * 60_000 + 90 * 60_000),
    status: "confirmed",
  },
  {
    id: "b3",
    roomId: "r2",
    roomName: "Studio B",
    userId: "u1",
    memberName: "You",
    instrument: "Electric Guitar",
    mode: "individual",
    startsAt: new Date(NOW.getTime() - 2 * 24 * 60 * 60_000),
    endsAt:   new Date(NOW.getTime() - 2 * 24 * 60 * 60_000 + 45 * 60_000),
    status: "completed",
  },
  {
    id: "b4",
    roomId: "r4",
    roomName: "Recording Booth",
    userId: "u1",
    memberName: "You",
    instrument: "Vocals",
    mode: "individual",
    startsAt: new Date(NOW.getTime() - 7 * 24 * 60 * 60_000),
    endsAt:   new Date(NOW.getTime() - 7 * 24 * 60 * 60_000 + 30 * 60_000),
    status: "cancelled",
  },
];

export default function BookingsPage() {
  const upcoming = ALL_BOOKINGS.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const past = ALL_BOOKINGS.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <div className="section">
      <div className="container flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-1">
              My Sessions
            </p>
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Bookings
            </h1>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 h-10 rounded-[var(--radius-full)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            <Plus size={15} /> New Booking
          </Link>
        </div>

        {/* Upcoming */}
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text)]">Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="card text-center py-10 text-[var(--color-text-muted)] text-sm">
              No upcoming bookings.{" "}
              <Link href="/rooms" className="text-[var(--color-accent)] hover:underline">
                Book a slot →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text)]">History</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </section>

        <p className="text-xs text-[var(--color-text-dim)] text-center">
          ⚠️ Placeholder data — Supabase integration in Milestone 3.
        </p>
      </div>
    </div>
  );
}

