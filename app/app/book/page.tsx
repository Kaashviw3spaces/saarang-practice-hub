"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Music2, Users, AlertCircle, CheckCircle2 } from "lucide-react";

const ROOM_OPTIONS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Studio A (Soundproof Rehearsal)" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Studio B (Intimate Practice Room)" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Jam Room (Ensemble Space)" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Recording Booth (Vocals & Acoustic)" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Electronics Corner (Synth & DAW)" },
];

export default function BookingPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState(ROOM_OPTIONS[0].id);
  const [instrument, setInstrument] = useState("Electric Guitar");
  const [mode, setMode] = useState<"individual" | "collaborative" | "band_rehearsal">("individual");
  const [date, setDate] = useState("2026-10-18");
  const [startTime, setStartTime] = useState("16:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          instrument,
          mode,
          date,
          startTime,
          durationMinutes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to create booking");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/bookings");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create reservation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-xl card flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Reserve Time
          </p>
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
            Book Practice Room
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Choose your setup, room, and session duration. Real-time conflict checks will validate availability.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-[var(--radius-sm)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)]">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-[var(--radius-sm)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)]">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Slot reserved successfully! Redirecting to your bookings...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Room selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-muted)]">
              Practice Room
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            >
              {ROOM_OPTIONS.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode & Instrument grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Users size={14} /> Practice Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "individual" | "collaborative" | "band_rehearsal")}
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="individual">Solo Practice</option>
                <option value="collaborative">Collaborative Jam</option>
                <option value="band_rehearsal">Full-Band Rehearsal</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Music2 size={14} /> Primary Instrument
              </label>
              <input
                type="text"
                required
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                placeholder="e.g. Electric Guitar, Drums"
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1.5">
                <Clock size={14} /> Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 h-11 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Checking Availability…" : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
