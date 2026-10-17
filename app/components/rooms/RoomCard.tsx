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
} from "lucide-react";

/* ─── Status badge ────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  RoomStatus,
  { label: string; color: string; dot: string }
> = {
  available: {
    label: "Available",
    color: "text-[var(--color-available)]",
    dot: "bg-[var(--color-available)]",
  },
  reserved: {
    label: "Reserved",
    color: "text-[var(--color-reserved)]",
    dot: "bg-[var(--color-reserved)]",
  },
  occupied: {
    label: "Occupied",
    color: "text-[var(--color-occupied)]",
    dot: "bg-[var(--color-occupied)]",
  },
  departure_pending: {
    label: "Finishing up",
    color: "text-[var(--color-pending)]",
    dot: "bg-[var(--color-pending)]",
  },
  occupancy_uncertain: {
    label: "Status unclear",
    color: "text-[var(--color-uncertain)]",
    dot: "bg-[var(--color-uncertain)]",
  },
};

const MODE_LABELS: Record<PracticeMode, string> = {
  individual: "Solo practice",
  collaborative: "Collaborative",
  band_rehearsal: "Band rehearsal",
};

function StatusBadge({ status }: { status: RoomStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest",
        cfg.color
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse",
          cfg.dot
        )}
      />
      {cfg.label}
    </span>
  );
}

/* ─── Instrument icon helper ──────────────────────────────────────────────── */

function InstrumentIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("drum") || lower.includes("percus")) return <Drum size={14} />;
  if (lower.includes("guitar") || lower.includes("bass")) return <Guitar size={14} />;
  if (lower.includes("piano") || lower.includes("keyboard")) return <Piano size={14} />;
  if (lower.includes("vocal") || lower.includes("voice") || lower.includes("mic")) return <Mic2 size={14} />;
  return <Music2 size={14} />;
}

/* ─── Main card ───────────────────────────────────────────────────────────── */

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  capacity: number;
  status: RoomStatus;
  equipment: string[];
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
    // Also trigger on next tick to avoid synchronous update in effect
    const initialTimer = setTimeout(calculateRemaining, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [currentBooking]);

  return (
    <div
      className={cn(
        "card group relative flex flex-col gap-4 transition-all duration-200",
        isBookable && "hover:border-[var(--color-accent)]/50 hover:shadow-lg hover:shadow-black/30"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-text)] leading-tight truncate">
            {name}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)] line-clamp-2">
            {description}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Current session info */}
      {currentBooking ? (
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-4 py-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <InstrumentIcon name={currentBooking.instrument} />
            <span className="font-medium text-[var(--color-text)]">
              {currentBooking.instrument}
            </span>
            <span>·</span>
            <span>{MODE_LABELS[currentBooking.mode]}</span>
          </div>
          {endsIn !== null && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Clock size={12} />
              <span>
                {endsIn > 0 ? `Ends in ${endsIn} min` : "Session ending soon"}
              </span>
            </div>
          )}
        </div>
      ) : nextAvailableAt ? (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Clock size={12} />
          <span>
            Next slot at{" "}
            {nextAvailableAt.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      ) : null}

      {/* Equipment chips */}
      {equipment.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {equipment.slice(0, 4).map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]"
            >
              {item.toLowerCase().includes("headphone") && <Headphones size={10} />}
              {item.toLowerCase().includes("amp") && <Volume2 size={10} />}
              {item}
            </span>
          ))}
          {equipment.length > 4 && (
            <span className="text-[11px] text-[var(--color-text-dim)] self-center">
              +{equipment.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)]">
          <Users size={12} />
          Capacity: {capacity}
        </span>
        <button
          onClick={() => onBook?.(id)}
          disabled={!isBookable}
          className={cn(
            "inline-flex h-8 items-center rounded-[var(--radius-full)] px-4 text-xs font-semibold transition-all",
            isBookable
              ? "bg-[var(--color-accent)] text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] cursor-pointer"
              : "bg-[var(--color-surface-2)] text-[var(--color-text-dim)] cursor-not-allowed"
          )}
        >
          {isBookable ? "Book Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
