"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { BookingCard } from "@/components/bookings/BookingCard";
import { type Booking } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";

/* ─── Supabase row shape ──────────────────────────────────────────────────── */
interface BookingRow {
  id: string;
  room_id: string;
  user_id: string;
  instrument: string;
  mode: Booking["mode"];
  starts_at: string;
  ends_at: string;
  status: Booking["status"];
  rooms: { name: string } | null;
}

function toBooking(row: BookingRow, userEmail: string): Booking {
  return {
    id: row.id,
    roomId: row.room_id,
    roomName: row.rooms?.name ?? "Unknown Session",
    userId: row.user_id,
    memberName: userEmail.split("@")[0],
    instrument: row.instrument,
    mode: row.mode,
    startsAt: new Date(row.starts_at),
    endsAt: new Date(row.ends_at),
    status: row.status,
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthChecked(true);

      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data, error: err } = await supabase
        .from("bookings")
        .select("*, rooms(name)")
        .eq("user_id", user.id)
        .order("starts_at", { ascending: true });

      if (err) {
        setError(err.message);
      } else {
        setBookings((data as BookingRow[]).map((row) => toBooking(row, user.email ?? "")));
      }
      setLoading(false);
    }

    fetchBookings();
  }, []);

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <div className="section">
      <div className="container flex flex-col gap-8">
        {/* Back navigation */}
        <BackButton href="/" label="Home" />

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

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-[var(--color-text-muted)]">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading your bookings…</span>
          </div>
        )}

        {/* Not logged in */}
        {authChecked && !loggedIn && !loading && (
          <div className="card text-center py-14 text-[var(--color-text-muted)] text-sm">
            <p className="mb-3">Sign in to see your bookings.</p>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-[var(--radius-full)] bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors"
            >
              Sign in →
            </Link>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="card text-center py-10 text-[var(--color-danger)] text-sm">
            Failed to load bookings: {error}
          </div>
        )}

        {/* Data */}
        {!loading && loggedIn && !error && (
          <>
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
            {past.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="font-semibold text-[var(--color-text)]">History</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {past.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              </section>
            )}

            {bookings.length === 0 && (
              <div className="card text-center py-14 text-[var(--color-text-muted)] text-sm">
                <p className="mb-3">You have no bookings yet.</p>
                <Link
                  href="/rooms"
                  className="inline-flex h-9 items-center rounded-[var(--radius-full)] bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors"
                >
                  Browse sessions →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
