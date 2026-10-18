"use client";

import { useState } from "react";
import { QrCode, CheckCircle2, LogOut, AlertCircle, Sparkles, Radio, Ticket, ArrowRight } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";

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
        setError("Failed to record doorway presence.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-cream)] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      {/* Arctic Monkeys AM high-contrast screenprint doorway backdrop */}
      <PosterBackdrop variant="checkin" overlayOpacity={0.45} />

      <div className="w-full max-w-md relative z-10">
        <BackButton href="/" label="Home" />
      </div>

      <div className="w-full max-w-md bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-ivory)]/40 shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3),0_16px_40px_rgba(0,0,0,0.7)] p-8 flex flex-col items-center text-center gap-6 relative z-10">
        {/* QR scanner target */}
        <div className="relative flex h-20 w-20 items-center justify-center bg-[var(--color-ink)] border-2 border-[var(--color-ochre)] text-[var(--color-ochre)] shadow-[3px_3px_0_0_var(--color-rust)]">
          <QrCode size={36} />
          {/* Corner marks */}
          <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[var(--color-cream)]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[var(--color-cream)]" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[var(--color-cream)]" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[var(--color-cream)]" />
        </div>

        <div>
          <span className="badge-tour badge-tour-rust mb-2">
            <Radio size={11} /> Doorway Terminal
          </span>
          <h1 className="font-[var(--font-poster)] text-3xl sm:text-4xl text-[var(--color-cream)] leading-none tracking-tight mt-1 poster-headline">
            STAGE CHECK-IN PORTAL
          </h1>
          <p className="mt-2 text-xs font-mono text-[var(--color-text-muted)] leading-relaxed">
            Scan at the doorway or select your pass below to reconcile occupancy and trigger session countdowns.
          </p>
        </div>

        {statusMessage && (
          <div className="w-full flex items-center gap-2 p-3 text-xs font-mono border border-[var(--color-available)] bg-[var(--color-available)]/15 text-[var(--color-cream)] text-left">
            <CheckCircle2 size={16} className="shrink-0 text-[var(--color-available)]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {error && (
          <div className="w-full flex items-center gap-2 p-3 text-xs font-mono border border-[var(--color-danger)] bg-[var(--color-danger)]/15 text-[var(--color-cream)] text-left">
            <AlertCircle size={16} className="shrink-0 text-[var(--color-danger)]" />
            <span>{error}</span>
          </div>
        )}

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1.5">
            <Ticket size={12} /> Rehearsal Pass Reference
          </label>
          <select
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 text-xs font-mono uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] cursor-pointer"
          >
            <option value="b1" className="bg-[var(--color-ink)]">Stage A — Electric Guitar (19:30 - 20:30)</option>
            <option value="b2" className="bg-[var(--color-ink)]">Jam Session Stage — Bass Guitar (18:00 - 19:30)</option>
            <option value="b3" className="bg-[var(--color-ink)]">Stage B — Electric Guitar (16:00 - 16:45)</option>
          </select>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleAction("check_in")}
            disabled={loading}
            className="btn-rock-primary text-sm py-2.5 shadow-[3px_3px_0_0_var(--color-rust)] disabled:opacity-50"
          >
            <CheckCircle2 size={15} /> Check In
          </button>
          <button
            onClick={() => handleAction("check_out")}
            disabled={loading}
            className="btn-rock-ghost text-sm py-2.5 disabled:opacity-50"
          >
            <LogOut size={15} /> Vacate Stage
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] pt-2 border-t border-[var(--color-border)] w-full justify-center">
          <Sparkles size={11} className="text-[var(--color-ochre)]" />
          <span>Real-time occupancy reconciliation active</span>
        </div>
      </div>
    </div>
  );
}
