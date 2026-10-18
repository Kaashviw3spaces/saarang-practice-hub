"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, Ticket, Sparkles, Calendar, Radio } from "lucide-react";
import { BookingCard } from "@/components/bookings/BookingCard";
import { type Booking } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";

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
    <div className="section min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
      <PosterBackdrop variant="rooms" overlayOpacity={0.35} />
      <div className="container flex flex-col gap-10 relative z-10">
        {/* Back navigation */}
        <div>
          <BackButton href="/" label="Home" />
        </div>

        {/* Page Header (Concert Gig Lineup Header) */}
        <div className="p-8 border border-[var(--color-ivory)]/40 bg-[var(--color-surface)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25)] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-tour badge-tour-accent">
                <Calendar size={12} /> REHEARSAL ARCHIVE
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                LIVE ITINERARY
              </span>
            </div>
            <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
              MY BOOKINGS
            </h1>
            <p className="mt-2 text-xs md:text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Active rehearsal bookings, confirmed slots, and studio reservation history.
            </p>
          </div>

          <Link
            href="/rooms"
            className="btn-rock-primary text-sm py-2.5 px-6 shadow-[3px_3px_0_0_var(--color-rust)] shrink-0 self-start sm:self-auto"
          >
            <Plus size={15} /> Book New Slot
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-sm uppercase tracking-widest">
            <Loader2 size={18} className="animate-spin text-[var(--color-ochre)]" />
            <span>SYNCING REHEARSAL SESSIONS FROM SUPABASE…</span>
          </div>
        )}

        {/* Not logged in */}
        {authChecked && !loggedIn && !loading && (
          <div className="p-12 text-center border-2 border-[var(--color-ivory)] bg-[var(--color-surface)] shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3)] max-w-xl mx-auto flex flex-col items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ochre)]">
              IDENTIFICATION REQUIRED
            </p>
            <h3 className="font-[var(--font-display)] text-3xl text-[var(--color-cream)]">
              SIGN IN TO VIEW YOUR BOOKINGS
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] max-w-sm">
              Your member profile links to all upcoming confirmed rehearsals and practice slots.
            </p>
            <Link
              href="/login"
              className="btn-rock-primary text-sm py-2 px-6 mt-2"
            >
              Sign In Now →
            </Link>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-6 border border-[var(--color-danger)] bg-[var(--color-danger)]/15 text-[var(--color-cream)] font-mono text-xs uppercase tracking-wider">
            FAILED TO RETRIEVE BOOKINGS: {error}
          </div>
        )}

        {/* Data List */}
        {!loading && loggedIn && !error && (
          <>
            {/* Upcoming Sessions */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                  <Calendar size={18} className="text-[var(--color-ochre)]" />
                  UPCOMING SESSIONS ({upcoming.length})
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                  AUTOMATED CONFLICT LOCKS ACTIVE
                </span>
              </div>

              {upcoming.length === 0 ? (
                <div className="p-10 text-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider">
                  No upcoming rehearsal slots booked.{" "}
                  <Link href="/rooms" className="text-[var(--color-ochre)] hover:underline ml-1">
                    Book a slot now →
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </section>

            {/* Past History */}
            {past.length > 0 && (
              <section className="flex flex-col gap-4 mt-6">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                  <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-cream)] tracking-wider">
                    ARCHIVED SETS ({past.length})
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                    COMPLETED REHEARSALS
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 opacity-75 hover:opacity-100 transition-opacity">
                  {past.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              </section>
            )}

            {bookings.length === 0 && (
              <div className="p-14 text-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-widest flex flex-col items-center gap-3">
                <p>YOU CURRENTLY HAVE ZERO RECORDED REHEARSAL BOOKINGS.</p>
                <Link
                  href="/rooms"
                  className="btn-rock-ghost text-xs py-2 px-6"
                >
                  Browse Available Stages →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
