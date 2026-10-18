"use client";

import { useState, useEffect } from "react";
import { type RoomStatus, type PracticeMode } from "@/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  Users,
  Music2,
  Mic2,
  Drum,
  Guitar,
  Piano,
  Headphones,
  Volume2,
  Zap,
  Radio,
  ArrowRight,
} from "lucide-react";

/* ─── Status badge (Vintage Gig / Stage Indicator) ────────────────────────── */

const STATUS_CONFIG: Record<
  RoomStatus,
  { label: string; bg: string; text: string; dot: string; frameClass: string }
> = {
  available: {
    label: "STAGE OPEN",
    bg: "bg-[var(--color-available)]/15 border-[var(--color-available)]",
    text: "text-[var(--color-available)]",
    dot: "bg-[var(--color-available)]",
    frameClass: "hover:border-[var(--color-available)]/60",
  },
  reserved: {
    label: "RESERVED",
    bg: "bg-[var(--color-reserved)]/15 border-[var(--color-reserved)]",
    text: "text-[var(--color-reserved)]",
    dot: "bg-[var(--color-reserved)]",
    frameClass: "hover:border-[var(--color-reserved)]/60",
  },
  occupied: {
    label: "IN REHEARSAL",
    bg: "bg-[var(--color-occupied)]/15 border-[var(--color-occupied)]",
    text: "text-[var(--color-occupied)]",
    dot: "bg-[var(--color-occupied)]",
    frameClass: "hover:border-[var(--color-occupied)]/60",
  },
  departure_pending: {
    label: "FINISHING UP",
    bg: "bg-[var(--color-pending)]/15 border-[var(--color-pending)]",
    text: "text-[var(--color-pending)]",
    dot: "bg-[var(--color-pending)]",
    frameClass: "hover:border-[var(--color-pending)]/60",
  },
  occupancy_uncertain: {
    label: "STATUS UNCLEAR",
    bg: "bg-[var(--color-uncertain)]/15 border-[var(--color-uncertain)]",
    text: "text-[var(--color-uncertain)]",
    dot: "bg-[var(--color-uncertain)]",
    frameClass: "hover:border-[var(--color-uncertain)]/60",
  },
};

const MODE_LABELS: Record<PracticeMode, string> = {
  individual: "Solo Set",
  collaborative: "Jam Session",
  band_rehearsal: "Full Band",
};

function StatusBadge({ status }: { status: RoomStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-widest rounded-none",
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

/* ─── Instrument icon helper ──────────────────────────────────────────────── */

function InstrumentIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("drum") || lower.includes("percus")) return <Drum size={13} />;
  if (lower.includes("guitar") || lower.includes("bass")) return <Guitar size={13} />;
  if (lower.includes("piano") || lower.includes("keyboard")) return <Piano size={13} />;
  if (lower.includes("vocal") || lower.includes("voice") || lower.includes("mic")) return <Mic2 size={13} />;
  return <Music2 size={13} />;
}

/* ─── Main Room Poster Card ───────────────────────────────────────────────── */

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  capacity: number;
  status: RoomStatus;
  equipment: string[];
  acousticProperties?: string;
  currentBooking?: {
    memberName: string;
    instrument: string;
    mode: PracticeMode;
    endsAt: Date;
  };
  nextAvailableAt?: Date;
  onBook?: (roomId: string) => void;
}

export function RoomCard({
  id,
  name,
  description,
  capacity,
  status,
  equipment,
  acousticProperties,
  currentBooking,
  nextAvailableAt,
  onBook,
}: RoomCardProps) {
  const isBookable = status === "available";
  const [endsIn, setEndsIn] = useState<number | null>(null);

  useEffect(() => {
    if (!currentBooking) return;

    const calculateRemaining = () => {
      const nowMs = currentBooking.endsAt.getTime();
      setEndsIn(Math.max(0, Math.floor((nowMs - Date.now()) / 60_000)));
    };

    const timer = setInterval(calculateRemaining, 60_000);
    const initialTimer = setTimeout(calculateRemaining, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [currentBooking]);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between bg-[var(--color-surface)] border border-[var(--color-border)] p-6 transition-all duration-300",
        "shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25)]",
        "hover:shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_4px_var(--color-cream),0_12px_28px_rgba(0,0,0,0.6)] hover:-translate-y-1",
        STATUS_CONFIG[status].frameClass
      )}
    >
      <div>
        {/* Top Header Row with Session ID & Status Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)] flex items-center gap-1">
            <Radio size={11} className="text-[var(--color-rust)]" /> STAGE // 0{id.replace(/\D/g, "") || "1"}
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Room Title & Description */}
        <div className="mb-4">
          <h3 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-cream)] leading-none tracking-tight group-hover:text-[var(--color-ochre)] transition-colors truncate">
            {name}
          </h3>
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Acoustic suitability stamp if available */}
        {acousticProperties && (
          <div className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--color-ochre)] border border-[var(--color-ochre)]/30 bg-[var(--color-ochre)]/10 px-2 py-0.5 mb-4">
            <Zap size={10} /> {acousticProperties}
          </div>
        )}

        {/* Current session info */}
        {currentBooking ? (
          <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-3 mb-4">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5 font-medium text-[var(--color-cream)]">
                <InstrumentIcon name={currentBooking.instrument} />
                {currentBooking.instrument}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                {MODE_LABELS[currentBooking.mode]}
              </span>
            </div>
            {endsIn !== null && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-ochre)] border-t border-[var(--color-border)]/60 pt-2">
                <Clock size={11} />
                <span>{endsIn > 0 ? `Ends in ${endsIn} min` : "Finishing up now"}</span>
              </div>
            )}
          </div>
        ) : nextAvailableAt ? (
          <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-2.5 mb-4 flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)]">
            <Clock size={12} className="text-[var(--color-ochre)]" />
            <span>
              Next slot:{" "}
              {nextAvailableAt.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        ) : null}

        {/* Gear / Equipment list */}
        {equipment.length > 0 && (
          <div className="mb-5">
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)] mb-1.5">
              Available Gear Inventory
            </p>
            <div className="flex flex-wrap gap-1">
              {equipment.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 bg-[var(--color-ink)] border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)]"
                >
                  {item.toLowerCase().includes("headphone") && <Headphones size={9} />}
                  {item.toLowerCase().includes("amp") && <Volume2 size={9} />}
                  {item}
                </span>
              ))}
              {equipment.length > 4 && (
                <span className="text-[10px] font-mono text-[var(--color-text-dim)] self-center px-1">
                  +{equipment.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ticket-Style Footer */}
      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
          <Users size={12} /> CAP: {capacity}
        </span>

        <button
          onClick={() => onBook?.(id)}
          disabled={!isBookable}
          className={cn(
            "inline-flex items-center gap-1.5 font-[var(--font-display)] text-sm uppercase tracking-wider px-4 py-1.5 transition-all",
            isBookable
              ? "bg-[var(--color-cream)] text-[var(--color-ink)] border border-[var(--color-cream)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] hover:shadow-[3px_3px_0_0_var(--color-rust)] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
              : "bg-[var(--color-surface-2)] text-[var(--color-text-dim)] border border-[var(--color-border)] cursor-not-allowed opacity-60"
          )}
        >
          {isBookable ? (
            <>
              Book Pass <ArrowRight size={13} />
            </>
          ) : (
            "Unavailable"
          )}
        </button>
      </div>
    </div>
  );
}
