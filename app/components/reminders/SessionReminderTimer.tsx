"use client";

import { useState, useEffect } from "react";
import { Clock, Bell, Plus, Check, Radio, Zap } from "lucide-react";

interface SessionTimerProps {
  initialMinutes?: number;
  sessionName?: string;
}

export function SessionReminderTimer({
  initialMinutes = 60,
  sessionName = "Session A",
}: SessionTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [extensionRequested, setExtensionRequested] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;

        // Mid-session chime (at 50% time)
        if (next === Math.floor((initialMinutes * 60) / 2)) {
          setNotification("Mid-session check-in: 50% of your allocated time remains.");
        }

        // Pre-expiry reminder (at 7 mins remaining)
        if (next === 7 * 60) {
          setNotification("Pre-expiry alert: 7 minutes remaining. Request extension or wrap up.");
        }

        // Final reminder (at 2 mins remaining)
        if (next === 2 * 60) {
          setNotification("Final warning: 2 minutes left. Disconnect gear for handover.");
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, initialMinutes]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleRequestExtension = () => {
    setSecondsLeft((prev) => prev + 15 * 60);
    setExtensionRequested(true);
    setNotification("Extension granted! +15 minutes added to your session.");
    setTimeout(() => setExtensionRequested(false), 4000);
  };

  return (
    <div className="relative flex flex-col gap-4 border border-[var(--color-ivory)]/40 bg-[var(--color-surface)]/95 backdrop-blur-md p-6 shadow-[0_24px_50px_-8px_rgba(0,0,0,0.95),0_12px_24px_-6px_rgba(0,0,0,0.88),inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-available)] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] flex items-center gap-1">
            <Radio size={12} /> LIVE STAGE CLOCK // {sessionName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
            REMAINING:
          </span>
          <span className="font-mono text-3xl font-bold tracking-wider text-[var(--color-cream)] bg-[var(--color-ink)] px-3 py-1 border border-[var(--color-border)] shadow-inner">
            {timeFormatted}
          </span>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-mono rounded-none bg-[var(--color-ochre)]/10 border border-[var(--color-ochre)] text-[var(--color-cream)]">
          <Bell size={14} className="shrink-0 text-[var(--color-ochre)]" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
          <Zap size={12} className="text-[var(--color-rust)]" /> Need more stage time before handover?
        </span>
        <button
          onClick={handleRequestExtension}
          disabled={extensionRequested}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 font-[var(--font-display)] text-sm uppercase tracking-wider bg-[var(--color-ink)] border border-[var(--color-ivory)] text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors cursor-pointer disabled:opacity-50"
        >
          {extensionRequested ? (
            <>
              <Check size={14} className="text-[var(--color-available)]" /> +15m Extended
            </>
          ) : (
            <>
              <Plus size={14} /> Request +15m Extension
            </>
          )}
        </button>
      </div>
    </div>
  );
}
