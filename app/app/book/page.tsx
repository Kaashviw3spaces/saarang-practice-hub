"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Music2,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Radio,
  Sparkles,
  ArrowRight,
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

  const [instrumentsList, setInstrumentsList] = useState<string[]>([
    "Electric Guitar",
    "Acoustic Drums",
    "Bass Guitar",
    "Piano",
    "Synthesizer / Keyboard",
    "Vocals (Amplified)",
    "Acoustic Guitar",
  ]);

  // Selected instruments for collaborative jam sessions (multi-select)
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([
    "Electric Guitar",
    "Acoustic Drums",
  ]);

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments((prev) => {
      if (prev.includes(inst)) {
        if (prev.length <= 1) return prev; // Keep at least one selected
        return prev.filter((i) => i !== inst);
      } else {
        return [...prev, inst];
      }
    });
  };

  // Async state
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch available rooms and instruments from seed.sql / database
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);

    fetch("/api/rooms", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { rooms?: { id: string; name: string }[]; instruments?: { name: string }[] }) => {
        if (json.rooms && json.rooms.length > 0) {
          const mapped = json.rooms.map((r) => ({ id: r.id, name: r.name }));
          setRooms(mapped);
          setRoomId(mapped[0].id);
        } else {
          const defaultOpts: RoomOption[] = [
            { id: "seed-a", name: "Session A" },
            { id: "seed-b", name: "Session B" },
            { id: "seed-jam", name: "Jam Session" },
            { id: "seed-rec", name: "Recording Session" },
          ];
          setRooms(defaultOpts);
          setRoomId(defaultOpts[0].id);
        }

        if (json.instruments && json.instruments.length > 0) {
          const names = json.instruments.map((i) => i.name);
          setInstrumentsList(names);
        }
        setRoomsLoading(false);
      })
      .catch(() => {
        setRoomsLoading(false);
      });
  }, []);

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const isSessionA = Boolean(selectedRoom?.name.toLowerCase().includes("session a"));
  const isSessionB = Boolean(selectedRoom?.name.toLowerCase().includes("session b"));
  const isBandRehearsal = mode === "band_rehearsal";
  const isCollaborative = mode === "collaborative";

  // Compute available instruments based on room & mode:
  // - In Session B, drums and electric guitar are prohibited for both solo & collaborative practice
  // - In Session A solo practice, only Drums and Electric Guitar are permitted
  const currentAllowedInstruments = useMemo(() => {
    if (isSessionB) {
      return instrumentsList.filter((inst) => {
        const lower = inst.toLowerCase();
        return !lower.includes("drum") && !lower.includes("electric guitar");
      });
    }

    if (isSessionA && mode === "individual") {
      const filtered = instrumentsList.filter((inst) => {
        const lower = inst.toLowerCase();
        return lower.includes("drum") || lower.includes("electric guitar");
      });
      return filtered.length > 0 ? filtered : ["Acoustic Drums", "Electric Guitar"];
    }

    return instrumentsList;
  }, [isSessionA, isSessionB, mode, instrumentsList]);

  // Keep mode in sync: if user selects Session B, full band rehearsal is not permitted
  useEffect(() => {
    if (isSessionB && mode === "band_rehearsal") {
      setMode("individual");
    }
  }, [isSessionB, mode]);

  // Keep collaborative multi-select instruments in sync when switching to Session B
  useEffect(() => {
    if (isSessionB) {
      setSelectedInstruments((prev) => {
        const cleaned = prev.filter(
          (inst) =>
            !inst.toLowerCase().includes("drum") &&
            !inst.toLowerCase().includes("electric guitar")
        );
        if (cleaned.length > 0) return cleaned;
        return currentAllowedInstruments.length > 0 ? [currentAllowedInstruments[0]] : [];
      });
    }
  }, [isSessionB, currentAllowedInstruments]);

  // Keep instrument in sync when room or mode changes
  useEffect(() => {
    if (isBandRehearsal) {
      setInstrument("Full Band Setup");
    } else if (isCollaborative) {
      // Ensure at least one instrument is selected in collaborative mode
      if (selectedInstruments.length === 0 && currentAllowedInstruments.length > 0) {
        setSelectedInstruments([currentAllowedInstruments[0]]);
      }
    } else if (!currentAllowedInstruments.includes(instrument)) {
      setInstrument(currentAllowedInstruments[0] || "Piano");
    }
  }, [isBandRehearsal, isCollaborative, currentAllowedInstruments, instrument, selectedInstruments]);

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
          "STAGE CONFLICT: This slot is already locked by another member. Please select a different time or slot."
        );
      }

      // Insert booking - Full band rehearsal covers all instruments, collaborative jam combines selected instruments
      let finalInstrument = instrument;
      if (isBandRehearsal) {
        if (isSessionB) {
          throw new Error("Full band rehearsals are not available in Session B.");
        }
        finalInstrument = "Full Band Setup";
      } else if (isCollaborative) {
        if (selectedInstruments.length === 0) {
          throw new Error("Please select at least one instrument for your collaborative jam session.");
        }
        finalInstrument = selectedInstruments.join(", ");
      }

      // Extra safety check for Session B acoustic policy
      if (isSessionB) {
        const lower = finalInstrument.toLowerCase();
        if (lower.includes("drum") || lower.includes("electric guitar")) {
          throw new Error("Drums and Electric Guitar are not permitted in Session B.");
        }
      }

      const { error: insertError } = await supabase.from("bookings").insert({
        room_id: roomId,
        user_id: user.id,
        instrument: finalInstrument,
        mode,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "confirmed",
      });

      if (insertError) throw new Error(insertError.message);

      setSuccess(true);
      setTimeout(() => router.push("/bookings"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to confirm reservation.");
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

      {/* Rehearsal Booking Card */}
      <div className="w-full max-w-2xl bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-ivory)]/40 shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3),0_16px_40px_rgba(0,0,0,0.7)] p-8 md:p-10 flex flex-col gap-6 relative z-10">
        {/* Top Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="badge-tour badge-tour-rust">PRACTICE HUB</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              SLOT ALLOCATION
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ochre)]">
            CONFLICT LOCK: ACTIVE
          </span>
        </div>

        <div>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
            BOOK REHEARSAL SLOT
          </h1>
          <p className="mt-2 text-xs md:text-sm text-[var(--color-text-muted)] max-w-lg leading-relaxed">
            Check your setup, select slot, and lock in your rehearsal window with automated conflict
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
            <span>REHEARSAL RESERVATION CONFIRMED! Redirecting to your bookings…</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* STEP 01: Stage Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
              <Radio size={13} /> [STEP 01] Practice Session slot
            </label>
            {roomsLoading ? (
              <div className="flex items-center gap-2 h-11 px-3 bg-[var(--color-ink)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)]">
                <Loader2 size={14} className="animate-spin text-[var(--color-ochre)]" />
                Querying available slots…
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
          <div className="flex flex-col gap-3">
            {isBandRehearsal && !isSessionB ? (
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
                      Solo Practice
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
                    <Sparkles size={13} /> Band Equipment Setup
                  </label>
                  <div className="h-11 px-3 bg-[var(--color-rust)]/15 border border-[var(--color-rust)]/50 flex items-center gap-2 text-xs font-mono text-[var(--color-cream)]">
                    <CheckCircle2 size={14} className="text-[var(--color-ochre)] shrink-0" />
                    <span className="truncate uppercase font-bold text-[var(--color-cream)]">
                      All Instruments Included
                    </span>
                  </div>
                </div>
              </div>
            ) : isCollaborative ? (
              <div className="flex flex-col gap-4">
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
                      Solo Practice
                    </option>
                    <option value="collaborative" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                      Collaborative Jam
                    </option>
                    {!isSessionB && (
                      <option value="band_rehearsal" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                        Full Band Rehearsal
                      </option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
                      <Music2 size={13} /> Your Instruments (Select Multiple)
                    </label>
                    <span className="text-[10px] font-mono uppercase text-[var(--color-ochre)]">
                      {selectedInstruments.length} Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[var(--color-ink)] border border-[var(--color-border)]">
                    {currentAllowedInstruments.map((inst) => {
                      const isSelected = selectedInstruments.includes(inst);
                      return (
                        <button
                          key={inst}
                          type="button"
                          onClick={() => toggleInstrument(inst)}
                          className={`flex items-center gap-2 p-2.5 text-xs font-mono transition-all text-left border cursor-pointer ${
                            isSelected
                              ? "bg-[var(--color-rust)]/25 border-[var(--color-rust)] text-[var(--color-cream)] font-bold shadow-[inset_0_0_0_1px_var(--color-rust)]"
                              : "bg-[var(--color-surface)]/60 border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-cream)]"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-none border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[var(--color-rust)] border-[var(--color-ochre)] text-[var(--color-cream)]"
                                : "border-[var(--color-border)] bg-[var(--color-ink)]"
                            }`}
                          >
                            {isSelected && <CheckCircle2 size={12} className="text-[var(--color-cream)]" />}
                          </div>
                          <span className="truncate">{inst}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
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
                      Solo Practice
                    </option>
                    <option value="collaborative" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                      Collaborative Jam
                    </option>
                    {!isSessionB && (
                      <option value="band_rehearsal" className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                        Full Band Rehearsal
                      </option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
                      <Music2 size={13} /> Primary Instrument
                    </label>
                    {isSessionA && mode === "individual" && (
                      <span className="text-[9px] font-mono text-[var(--color-rust)] uppercase font-semibold">
                        Drums / Elec Guitar Only
                      </span>
                    )}
                  </div>
                  <select
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs md:text-sm font-mono uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] transition-colors cursor-pointer"
                  >
                    {currentAllowedInstruments.map((inst) => (
                      <option key={inst} value={inst} className="bg-[var(--color-ink)] text-[var(--color-cream)]">
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Contextual Guidance Notes */}
            {isBandRehearsal && !isSessionB && (
              <div className="p-3.5 border border-[var(--color-ochre)]/40 bg-[var(--color-ochre)]/10 text-xs font-mono text-[var(--color-cream)] flex items-start gap-2.5">
                <Users size={16} className="text-[var(--color-ochre)] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-[var(--color-ochre)] uppercase tracking-wider block mb-0.5">
                    Single Band Booking Covers All Members
                  </span>
                  <span className="text-[var(--color-text-dim)]">
                    Only one band member needs to book this slot for everyone. No need to select individual instruments — the entire session space and all backline gear are reserved for your full band.
                  </span>
                </div>
              </div>
            )}

            {isCollaborative && (
              <div className="p-3.5 border border-[var(--color-ochre)]/40 bg-[var(--color-ochre)]/10 text-xs font-mono text-[var(--color-cream)] flex items-start gap-2.5">
                <Users size={16} className="text-[var(--color-ochre)] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-[var(--color-ochre)] uppercase tracking-wider block mb-0.5">
                    One Member Books For The Entire Jam
                  </span>
                  <span className="text-[var(--color-text-dim)]">
                    Only one member needs to book this jam session for the group. Select all instruments that will be played above.
                  </span>
                </div>
              </div>
            )}

            {isSessionA && mode === "individual" && (
              <div className="p-3 border border-[var(--color-border)] bg-[var(--color-ink)] text-xs font-mono text-[var(--color-cream)] flex items-start gap-2.5">
                <AlertCircle size={15} className="text-[var(--color-ochre)] shrink-0 mt-0.5" />
                <span className="text-[var(--color-text-muted)] text-[11px] leading-relaxed">
                  <strong className="text-[var(--color-cream)]">Session A Solo Policy:</strong> Solo rehearsal in Session A is strictly restricted to <strong className="text-[var(--color-ochre)]">Drums</strong> or <strong className="text-[var(--color-ochre)]">Electric Guitar</strong> practice.
                </span>
              </div>
            )}

            {isSessionB && (
              <div className="p-3 border border-[var(--color-border)] bg-[var(--color-ink)] text-xs font-mono text-[var(--color-cream)] flex items-start gap-2.5">
                <AlertCircle size={15} className="text-[var(--color-ochre)] shrink-0 mt-0.5" />
                <span className="text-[var(--color-text-muted)] text-[11px] leading-relaxed">
                  <strong className="text-[var(--color-cream)]">Session B Acoustic Policy:</strong> Full band rehearsals, <strong className="text-[var(--color-rust)]">drums</strong>, and <strong className="text-[var(--color-rust)]">electric guitar</strong> are not permitted in Session B. Suitable for solo practice, duets, vocals, acoustic instruments, or electronic/piano sessions.
                </span>
              </div>
            )}
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
                VERIFYING SLOT AVAILABILITY…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                CONFIRM RESERVATION <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
