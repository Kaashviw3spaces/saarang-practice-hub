"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoomCard } from "@/components/rooms/RoomCard";
import { type Room } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";
import { Filter, Search, Loader2, Radio, Sparkles, Zap } from "lucide-react";



export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/rooms", { cache: "no-store" });
        const json = await res.json();
        const seedRooms: Room[] = json.rooms ?? [];

        // Check if Supabase has live room status overrides
        const { data: dbData } = await supabase
          .from("rooms")
          .select("name, status");

        const statusMap = new Map<string, Room["status"]>();
        if (dbData) {
          for (const item of dbData) {
            statusMap.set(item.name.toLowerCase().trim(), item.status as Room["status"]);
          }
        }

        const finalRooms = seedRooms.map((r) => {
          const liveStatus = statusMap.get(r.name.toLowerCase().trim());
          return liveStatus ? { ...r, status: liveStatus } : r;
        });

        setRooms(finalRooms);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load rooms");
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
    const interval = setInterval(fetchRooms, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
      {/* Background Metallica Aragon Ballroom 1985 & Arctic Monkeys poster art */}
      <PosterBackdrop variant="rooms" overlayOpacity={0.3} />

      <div className="container relative z-10 flex flex-col gap-10">
        {/* Back navigation */}
        <div>
          <BackButton href="/" label="Home" />
        </div>

        {/* Page Header (Aragon Ballroom / Arctic Monkeys poster styling) */}
        <div className="p-8 border border-[var(--color-ivory)]/40 bg-[var(--color-surface)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25)] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
            <span className="badge-tour badge-tour-accent">
              <Radio size={12} /> LIVE SLOT RADAR
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              FREQUENCY REFRESH: 30s INTERVAL
            </span>
          </div>

          <div>
            <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
              PRACTICE SESSIONS
            </h1>
            <p className="mt-2 text-sm md:text-base text-[var(--color-text-muted)] max-w-2xl leading-relaxed poster-subhead">
              Explore available rehearsal slots. Inspect available instruments and lock in your practice slot.
            </p>
          </div>

          {/* Status legend with vintage concert badges */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--color-border)] text-xs font-mono">
            {[
              { label: "SLOT OPEN", dot: "bg-[var(--color-available)]", text: "text-[var(--color-available)]" },
              { label: "RESERVED", dot: "bg-[var(--color-reserved)]", text: "text-[var(--color-reserved)]" },
              { label: "IN REHEARSAL", dot: "bg-[var(--color-occupied)]", text: "text-[var(--color-occupied)]" },
              { label: "FINISHING UP", dot: "bg-[var(--color-pending)]", text: "text-[var(--color-pending)]" },
              { label: "STATUS UNCLEAR", dot: "bg-[var(--color-uncertain)]", text: "text-[var(--color-uncertain)]" },
            ].map(({ label, dot, text }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-ink)] border border-[var(--color-border)]">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                <span className={`text-[10px] uppercase font-bold tracking-wider ${text}`}>{label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Search + filter row with vintage frame */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
            />
            <input
              type="text"
              placeholder="Search slots or instruments…"
              disabled
              className="w-full h-11 bg-[var(--color-surface)] border border-[var(--color-border)] pl-10 pr-4 text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] placeholder:text-[var(--color-text-dim)] cursor-not-allowed opacity-60 shadow-[inset_0_0_0_1px_rgba(238,230,213,0.1)]"
            />
          </div>
          <button
            disabled
            className="inline-flex items-center gap-2 h-11 px-5 border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-mono uppercase tracking-widest text-[var(--color-text-dim)] cursor-not-allowed opacity-60"
          >
            <Filter size={13} /> Filters
            <span className="text-[10px] text-[var(--color-ochre)] font-semibold">[planned]</span>
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-[var(--color-text-muted)] font-mono text-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Loader2 size={18} className="animate-spin text-[var(--color-ochre)]" />
            <span className="uppercase tracking-widest">CONNECTING TO SLOT SENSORS…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-8 text-center border border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-cream)] font-mono text-xs uppercase tracking-wider">
            Failed to query slot data: {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && rooms.length === 0 && (
          <div className="p-12 text-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-widest">
            NO SLOTS RETURNED FROM SLOT CONTROLLER. VERIFY SUPABASE CONNECTION.
          </div>
        )}

        {/* Session grid */}
        {!loading && rooms.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                onBook={() => router.push("/book")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
