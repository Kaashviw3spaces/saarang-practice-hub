"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Music2,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Ticket,
  Zap,
  ArrowRight,
  Radio,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";

interface RoomOption {
  id: string;
  name: string;
}

export default function BookingPage() {
  const router = useRouter();

  // Form state
  const [roomId, setRoomId] = useState("");
  const [instrument, setInstrument] = useState("Electric Guitar");
  const [mode, setMode] = useState<"individual" | "collaborative" | "band_rehearsal">("individual");
  const [date, setDate] = useState("2026-10-18");
  const [startTime, setStartTime] = useState("16:00");
  const [durationMinutes, setDurationMinutes] = useState(60);

  // Async state
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch available rooms for the dropdown
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);

    supabase
      .from("rooms")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        const opts = (data ?? []) as RoomOption[];
        setRooms(opts);
        if (opts.length > 0) setRoomId(opts[0].id);
        setRoomsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Build timestamps
      const startsAt = new Date(`${date}T${startTime}:00`);
      const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

      // Check for overlapping confirmed bookings in the same room
      const { data: conflicts } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", roomId)
        .eq("status", "confirmed")
        .lt("starts_at", endsAt.toISOString())
        .gt("ends_at", startsAt.toISOString());

      if (conflicts && conflicts.length > 0) {
        throw new Error(
          "STAGE CONFLICT: This slot is already locked by another artist. Please select a different time or stage."
        );
      }

      // Insert booking
      const { error: insertError } = await supabase.from("bookings").insert({
        room_id: roomId,
        user_id: user.id,
        instrument,
        mode,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "confirmed",
      });

      if (insertError) throw new Error(insertError.message);

      setSuccess(true);
      setTimeout(() => router.push("/bookings"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate pass.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-cream)] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      {/* AC/DC high-voltage electric lightning background */}
      <PosterBackdrop variant="booking" overlayOpacity={0.32} />

      <div className="w-full max-w-2xl relative z-10">
        <BackButton href="/rooms" label="Back to Sessions" />
      </div>

      {/* Backstage Pass Booking Card */}
      <div className="w-full max-w-2xl bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-ivory)]/40 shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3),0_16px_40px_rgba(0,0,0,0.7)] p-8 md:p-10 flex flex-col gap-6 relative z-10">
        {/* Top Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="badge-tour badge-tour-accent">
              <Ticket size={12} /> BACKSTAGE PASS
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              STAGE ALLOCATION FORM
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ochre)]">
            CONFLICT LOCK: ACTIVE
          </span>
        </div>

        <div>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
            BOOK REHEARSAL PASS
          </h1>
          <p className="mt-2 text-xs md:text-sm text-[var(--color-text-muted)] max-w-lg leading-relaxed">
            Configure your setup, select stage area, and lock in your rehearsal window with automated conflict
            checks.
          </p>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 text-xs font-mono border border-[var(--color-danger)] bg-[var(--color-danger)]/15 text-[var(--color-cream)]">
            <AlertCircle size={16} className="shrink-0 text-[var(--color-danger)]" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3.5 text-xs font-mono border border-[var(--color-available)] bg-[var(--color-available)]/15 text-[var(--color-cream)]">
            <CheckCircle2 size={16} className="shrink-0 text-[var(--color-available)]" />
            <span>REHEARSAL PASS CONFIRMED! Generating wristband and redirecting to your bookings…</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* STEP 01: Stage Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
              <Radio size={13} /> [STEP 01] Practice Session Stage
            </label>
            {roomsLoading ? (
              <div className="flex items-center gap-2 h-11 px-3 bg-[var(--color-ink)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)]">
                <Loader2 size={14} className="animate-spin text-[var(--color-ochre)]" />
                Querying available stages…
              </div>
            ) : (
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs md:text-sm font-mono uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors cursor-pointer"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id} className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                    {room.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* STEP 02: Mode & Instrument */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
                <Users size={13} /> [STEP 02] Practice Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "individual" | "collaborative" | "band_rehearsal")}
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs md:text-sm font-mono uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors cursor-pointer"
              >
                <option value="individual" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                  Solo Set
                </option>
                <option value="collaborative" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                  Collaborative Jam
                </option>
                <option value="band_rehearsal" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                  Full Band Rehearsal
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
                <Music2 size={13} /> Primary Instrument
              </label>
              <input
                type="text"
                required
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                placeholder="e.g. Electric Guitar, Drums"
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs md:text-sm font-mono text-[var(--color-cream)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors"
              />
            </div>
          </div>

          {/* STEP 03: Date, Time & Duration */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
                <Calendar size={13} /> Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs font-mono text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
                <Clock size={13} /> Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs font-mono text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)]">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs md:text-sm font-mono uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors cursor-pointer"
              >
                <option value={15} className="bg-[var(--color-ink)]">15 mins</option>
                <option value={30} className="bg-[var(--color-ink)]">30 mins</option>
                <option value={45} className="bg-[var(--color-ink)]">45 mins</option>
                <option value={60} className="bg-[var(--color-ink)]">60 mins</option>
                <option value={90} className="bg-[var(--color-ink)]">90 mins</option>
              </select>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading || roomsLoading}
            className="mt-2 btn-rock-primary text-base py-3.5 shadow-[4px_4px_0_0_var(--color-rust)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                VERIFYING STAGE AVAILABILITY…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                CONFIRM & ISSUE PASS <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
