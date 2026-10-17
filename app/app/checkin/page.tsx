"use client";

import { useState } from "react";
import { QrCode, CheckCircle2, LogOut, AlertCircle, Sparkles } from "lucide-react";

export default function CheckinPage() {
  const [bookingId, setBookingId] = useState("b1");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "check_in" | "check_out") => {
    setLoading(true);
    setStatusMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action, source: "doorway_qr" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setStatusMessage(data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to record entry.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md card flex flex-col items-center text-center gap-6 p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
          <QrCode size={28} />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Room Entrance Portal
          </p>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
            QR Check-In & Check-Out
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Scan or confirm physical presence to update room availability in real-time.
          </p>
        </div>

        {statusMessage && (
          <div className="w-full flex items-center gap-2 p-3 text-xs rounded-[var(--radius-sm)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)]">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {error && (
          <div className="w-full flex items-center gap-2 p-3 text-xs rounded-[var(--radius-sm)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)]">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="w-full flex flex-col gap-2 text-left">
          <label className="text-xs font-semibold text-[var(--color-text-muted)]">
            Confirmed Booking Reference
          </label>
          <select
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
          >
            <option value="b1">Session A — Electric Guitar (19:30 - 20:30)</option>
            <option value="b2">Jam Session Area — Bass Guitar (18:00 - 19:30)</option>
            <option value="b3">Session B — Electric Guitar (16:00 - 16:45)</option>
          </select>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleAction("check_in")}
            disabled={loading}
            className="h-11 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-xs font-bold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 size={15} /> Check In
          </button>
          <button
            onClick={() => handleAction("check_out")}
            disabled={loading}
            className="h-11 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs font-bold text-[var(--color-text)] hover:border-[var(--color-text-muted)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <LogOut size={15} /> Check Out
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-dim)] pt-2">
          <Sparkles size={12} className="text-[var(--color-accent)]" />
          <span>Automatic occupancy reconciliation active</span>
        </div>
      </div>
    </div>
  );
}
