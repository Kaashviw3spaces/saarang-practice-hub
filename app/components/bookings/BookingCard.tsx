import { type Booking } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, Music2, ChevronRight, X } from "lucide-react";

const STATUS_STYLES: Record<
  Booking["status"],
  { label: string; class: string }
> = {
  pending:   { label: "Pending",   class: "text-[var(--color-reserved)] bg-[var(--color-reserved)]/10" },
  confirmed: { label: "Confirmed", class: "text-[var(--color-secondary)] bg-[var(--color-secondary)]/10" },
  active:    { label: "Active",    class: "text-[var(--color-available)] bg-[var(--color-available)]/10" },
  completed: { label: "Done",      class: "text-[var(--color-text-dim)] bg-[var(--color-surface-2)]" },
  cancelled: { label: "Cancelled", class: "text-[var(--color-danger)] bg-[var(--color-danger)]/10" },
};

const MODE_LABELS = {
  individual:       "Solo",
  collaborative:    "Collaborative",
  band_rehearsal:   "Band",
};

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function BookingCard({ booking, onCancel, onViewDetails }: BookingCardProps) {
  const status = STATUS_STYLES[booking.status];
  const isUpcoming = booking.status === "confirmed" || booking.status === "pending";
  const isActive   = booking.status === "active";

  const startStr = booking.startsAt.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const endStr = booking.endsAt.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const dateStr = booking.startsAt.toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <div
      className={cn(
        "card flex flex-col gap-3 transition-all duration-200",
        isActive && "border-[var(--color-available)]/50 shadow-[0_0_0_1px_var(--color-available)]/20"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{dateStr}</p>
          <h4 className="font-semibold text-[var(--color-text)] leading-tight">
            {booking.roomName}
          </h4>
        </div>
        <span className={cn("text-[11px] font-semibold rounded-[var(--radius-sm)] px-2 py-0.5", status.class)}>
          {status.label}
        </span>
      </div>

      {/* Details row */}
      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {startStr} – {endStr}
        </span>
        <span className="text-[var(--color-border)]">·</span>
        <span className="flex items-center gap-1">
          <Music2 size={11} />
          {booking.instrument}
        </span>
        <span className="text-[var(--color-border)]">·</span>
        <span>{MODE_LABELS[booking.mode]}</span>
      </div>

      {/* Compatibility note */}
      {booking.compatibilityNote && (
        <p className="text-[11px] text-[var(--color-text-dim)] italic leading-relaxed">
          {booking.compatibilityNote}
        </p>
      )}

      {/* Actions */}
      {(isUpcoming || isActive) && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onViewDetails?.(booking.id)}
            className="flex-1 inline-flex items-center justify-center gap-1 h-7 rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Details <ChevronRight size={12} />
          </button>
          {isUpcoming && (
            <button
              onClick={() => onCancel?.(booking.id)}
              className="inline-flex items-center gap-1 h-7 px-3 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
            >
              <X size={12} /> Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

