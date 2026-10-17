import { BookingCard } from "@/components/bookings/BookingCard";
import { type Booking, type Room } from "@/types";
import Link from "next/link";
import {
  Music2,
  Calendar,
  Clock,
  Bell,
  Plus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ─── Placeholder data — replaced in Milestone 3 ─────────────────────────── */

const NOW = new Date();

const UPCOMING_BOOKINGS: Booking[] = [
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
];

const RECENT_BOOKINGS: Booking[] = [
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
];

const ROOM_STATUS_SUMMARY: Array<{ room: string; status: Room["status"]; note: string }> = [
  { room: "Studio A",         status: "available",          note: "Free now" },
  { room: "Studio B",         status: "occupied",           note: "Ends in 22 min" },
  { room: "Jam Room",         status: "reserved",           note: "Next slot in 45 min" },
  { room: "Recording Booth",  status: "departure_pending",  note: "Finishing up" },
  { room: "Electronics Corner", status: "occupancy_uncertain", note: "Status unclear" },
];

const STATUS_DOT: Record<Room["status"], string> = {
  available:           "bg-[var(--color-available)]",
  reserved:            "bg-[var(--color-reserved)]",
  occupied:            "bg-[var(--color-occupied)]",
  departure_pending:   "bg-[var(--color-pending)]",
  occupancy_uncertain: "bg-[var(--color-uncertain)]",
};

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="section">
      <div className="container flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-1">
              Welcome back
            </p>
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Your Dashboard
            </h1>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 h-10 rounded-[var(--radius-full)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            <Plus size={15} /> Book a Room
          </Link>
        </div>

        {/* Quick-action cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Book Slot",   href: "/rooms",    planned: false },
            { icon: CheckCircle2, label: "Check In",  href: "#",        planned: true },
            { icon: Clock,     label: "Extend",     href: "#",         planned: true },
            { icon: Bell,      label: "Reminders",  href: "#",         planned: true },
          ].map(({ icon: Icon, label, href, planned }) => (
            <Link
              key={label}
              href={href}
              className="card flex flex-col items-center gap-3 py-6 hover:border-[var(--color-accent)]/40 transition-all text-center group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/15 transition-colors">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
                {planned && (
                  <p className="text-[10px] text-[var(--color-accent)] mt-0.5">[planned]</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Main two-column grid */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ─ Left: Bookings ─ */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Upcoming */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Calendar size={16} className="text-[var(--color-accent)]" />
                  Upcoming Sessions
                </h2>
                <Link
                  href="/bookings"
                  className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-0.5"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {UPCOMING_BOOKINGS.length === 0 ? (
                <div className="card text-center py-10 text-[var(--color-text-muted)] text-sm">
                  No upcoming bookings. <Link href="/rooms" className="text-[var(--color-accent)] hover:underline">Book a slot →</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {UPCOMING_BOOKINGS.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent */}
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Clock size={16} className="text-[var(--color-accent)]" />
                Recent Sessions
              </h2>
              <div className="flex flex-col gap-3">
                {RECENT_BOOKINGS.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            </div>
          </div>

          {/* ─ Right: Room status + notifications ─ */}
          <div className="flex flex-col gap-6">

            {/* Room status */}
            <div className="card flex flex-col gap-4">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Music2 size={16} className="text-[var(--color-accent)]" />
                Room Status
              </h2>
              <div className="flex flex-col gap-3">
                {ROOM_STATUS_SUMMARY.map(({ room, status, note }) => (
                  <div key={room} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[status]}`}
                      />
                      <span className="text-sm text-[var(--color-text)] truncate">
                        {room}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                      {note}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/rooms"
                className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-0.5 mt-1"
              >
                Full room view <ArrowRight size={11} />
              </Link>
            </div>

            {/* Notifications placeholder */}
            <div className="card flex flex-col gap-4">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Bell size={16} className="text-[var(--color-accent)]" />
                Notifications
              </h2>
              <div className="flex flex-col gap-2">
                <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 flex flex-col gap-0.5">
                  <p className="text-sm text-[var(--color-text)]">Studio A booking confirmed</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Starts in 1 hour</p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 flex flex-col gap-0.5 opacity-60">
                  <p className="text-sm text-[var(--color-text)]">Jam Room slot released</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Yesterday · 4:30 PM</p>
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-dim)]">
                Push notifications coming in Milestone 6
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-dim)] text-center">
          ⚠️ All data is placeholder until Supabase integration (Milestone 3).
        </p>
      </div>
    </div>
  );
}

