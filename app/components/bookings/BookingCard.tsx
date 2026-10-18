"use client";

import { type Booking } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, Music2, ChevronRight, X, Ticket, Sparkles, QrCode } from "lucide-react";

const STATUS_STYLES: Record<
  Booking["status"],
  { label: string; class: string; borderClass: string }
> = {
  pending: {
    label: "RESERVED",
    class: "text-[var(--color-reserved)] bg-[var(--color-reserved)]/15 border-[var(--color-reserved)]/40",
    borderClass: "border-[var(--color-reserved)]/40",
  },
  confirmed: {
    label: "PASS CONFIRMED",
    class: "text-[var(--color-cream)] bg-[var(--color-ochre)]/20 border-[var(--color-ochre)]/60",
    borderClass: "border-[var(--color-ochre)]/50",
  },
  active: {
    label: "LIVE ON STAGE",
    class: "text-[var(--color-available)] bg-[var(--color-available)]/20 border-[var(--color-available)]",
    borderClass: "border-[var(--color-available)]",
  },
  completed: {
    label: "ARCHIVED SET",
    class: "text-[var(--color-text-dim)] bg-[var(--color-surface-2)] border-[var(--color-border)]",
    borderClass: "border-[var(--color-border)]",
  },
  cancelled: {
    label: "CANCELLED",
    class: "text-[var(--color-danger)] bg-[var(--color-danger)]/15 border-[var(--color-danger)]/40",
    borderClass: "border-[var(--color-danger)]/30",
  },
};

const MODE_LABELS = {
  individual: "Solo Set",
  collaborative: "Collab Jam",
  band_rehearsal: "Full Band",
};

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function BookingCard({ booking, onCancel, onViewDetails }: BookingCardProps) {
  const status = STATUS_STYLES[booking.status];
  const isUpcoming = booking.status === "confirmed" || booking.status === "pending";
  const isActive = booking.status === "active";

  const startStr = booking.startsAt.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const endStr = booking.endsAt.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = booking.startsAt.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between bg-[var(--color-surface)] border p-5 transition-all duration-300",
        "shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.2)]",
        "hover:shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_4px_var(--color-cream),0_8px_24px_rgba(0,0,0,0.5)]",
        status.borderClass
      )}
    >
      <div>
        {/* Ticket Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
            <Ticket size={12} className="text-[var(--color-ochre)]" />
            <span>PASS // #{booking.id.slice(0, 6)}</span>
          </div>
          <span
            className={cn(
              "px-2 py-0.5 text-[9px] font-mono uppercase font-bold tracking-widest border",
              status.class
            )}
          >
            {status.label}
          </span>
        </div>

        {/* Gig Info */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ochre)] mb-0.5">
              {dateStr}
            </p>
            <h4 className="font-[var(--font-poster)] text-2xl text-[var(--color-cream)] leading-none tracking-tight">
              {booking.roomName}
            </h4>
          </div>

          {/* Mini ticket stub faux barcode */}
          <div className="hidden sm:flex flex-col items-end opacity-40 group-hover:opacity-80 transition-opacity">
            <div className="flex gap-[2px] h-6 items-center">
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2].map((w, i) => (
                <span
                  key={i}
                  className="bg-[var(--color-ivory)] h-full inline-block"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <span className="text-[8px] font-mono tracking-widest text-[var(--color-text-dim)] mt-0.5">
              ADM-ONE
            </span>
          </div>
        </div>

        {/* Set Details */}
        <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-2.5 flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] mb-3">
          <span className="flex items-center gap-1 text-[var(--color-cream)]">
            <Clock size={11} className="text-[var(--color-ochre)]" />
            {startStr} – {endStr}
          </span>
          <span className="text-[var(--color-border)]">/</span>
          <span className="flex items-center gap-1 text-[var(--color-cream)]">
            <Music2 size={11} className="text-[var(--color-rust)]" />
            {booking.instrument}
          </span>
          <span className="text-[var(--color-border)]">/</span>
          <span className="text-[var(--color-text-dim)] uppercase tracking-wider text-[10px]">
            {MODE_LABELS[booking.mode]}
          </span>
        </div>

        {/* Acoustic AI Note */}
        {booking.compatibilityNote && (
          <p className="text-[11px] font-mono text-[var(--color-text-dim)] italic border-l-2 border-[var(--color-ochre)] pl-2 mb-3">
            {booking.compatibilityNote}
          </p>
        )}
      </div>

      {/* Ticket Actions */}
      {(isUpcoming || isActive) && (
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
          <button
            onClick={() => onViewDetails?.(booking.id)}
            className="flex-1 inline-flex items-center justify-center gap-1 h-8 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-mono uppercase tracking-wider text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            Pass Details <ChevronRight size={12} />
          </button>
          {isUpcoming && (
            <button
              onClick={() => onCancel?.(booking.id)}
              className="inline-flex items-center gap-1 h-8 px-3 border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-xs font-mono uppercase tracking-wider text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-colors cursor-pointer"
            >
              <X size={12} /> Void Pass
            </button>
          )}
        </div>
      )}
    </div>
  );
}
