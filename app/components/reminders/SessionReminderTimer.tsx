"use client";

import { useState, useEffect } from "react";
import { Clock, Bell, Plus, Check } from "lucide-react";

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
    // Extend by 15 mins if slot is available
    setSecondsLeft((prev) => prev + 15 * 60);
    setExtensionRequested(true);
    setNotification("Extension granted! +15 minutes added to your session.");
    setTimeout(() => setExtensionRequested(false), 4000);
  };

  return (
    <div className="card flex flex-col gap-4 border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[var(--color-accent)]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text)]">
            Active Session Timer: {sessionName}
          </span>
        </div>
        <span className="font-mono text-xl font-bold text-[var(--color-accent)]">
          {timeFormatted}
        </span>
      </div>

      {notification && (
        <div className="flex items-center gap-2 p-2.5 text-xs rounded-[var(--radius-sm)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)]">
          <Bell size={14} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-[var(--color-text-muted)]">
          Need more practice time?
        </span>
        <button
          onClick={handleRequestExtension}
          disabled={extensionRequested}
          className="h-8 px-4 rounded-[var(--radius-full)] bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {extensionRequested ? (
            <>
              <Check size={13} className="text-[var(--color-success)]" /> Extended
            </>
          ) : (
            <>
              <Plus size={13} /> Request 15m Extension
            </>
          )}
        </button>
      </div>
    </div>
  );
}

