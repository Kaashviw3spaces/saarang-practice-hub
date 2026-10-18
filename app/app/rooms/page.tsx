"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoomCard } from "@/components/rooms/RoomCard";
import { type Room } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";
import { Filter, Search, Loader2 } from "lucide-react";

/* ─── Supabase row shape ──────────────────────────────────────────────────── */
interface RoomRow {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  status: Room["status"];
  acoustic_properties: string | null;
  room_equipment: Array<{ equipment: { name: string } | null }>;
}

function toRoom(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    capacity: row.capacity,
    status: row.status,
    acousticProperties: row.acoustic_properties ?? "",
    equipment: row.room_equipment
      .map((re) => re.equipment?.name ?? "")
      .filter(Boolean),
  };
}

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("rooms")
        .select("*, room_equipment(equipment(name))")
        .order("name");

      if (err) {
        setError(err.message);
      } else {
        setRooms((data as RoomRow[]).map(toRoom));
      }
      setLoading(false);
    }

    fetchRooms();

    // Re-fetch every 30 s for near-real-time status
    const interval = setInterval(fetchRooms, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section">
      <div className="container flex flex-col gap-8">
        {/* Back navigation */}
        <BackButton href="/" label="Home" />

        {/* Page header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Live Status
          </p>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
            Practice Sessions
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl">
            All practice sessions updated in real time. Pick an area, check the current session and
            equipment, and book your slot instantly.
          </p>
        </div>

        {/* Search + filter row [planned] */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
            />
            <input
              type="text"
              placeholder="Search sessions or equipment…"
              disabled
              className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-4 text-sm text-[var(--color-text-muted)] placeholder:text-[var(--color-text-dim)] cursor-not-allowed opacity-60"
            />
          </div>
          <button
            disabled
            className="inline-flex items-center gap-2 h-10 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-dim)] cursor-not-allowed opacity-60"
          >
            <Filter size={14} /> Filter
            <span className="ml-1 text-[10px] text-[var(--color-accent)] font-semibold">[planned]</span>
          </button>
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
          {[
            { color: "var(--color-available)", label: "Available" },
            { color: "var(--color-reserved)",  label: "Reserved" },
            { color: "var(--color-occupied)",   label: "Occupied" },
            { color: "var(--color-pending)",    label: "Finishing up" },
            { color: "var(--color-uncertain)",  label: "Status unclear" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: color }}
              />
              {label}
            </span>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-[var(--color-text-muted)]">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading sessions…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="card text-center py-10 text-[var(--color-danger)] text-sm">
            Failed to load sessions: {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && rooms.length === 0 && (
          <div className="card text-center py-10 text-[var(--color-text-muted)] text-sm">
            No sessions found. Check back soon!
          </div>
        )}

        {/* Session grid */}
        {!loading && rooms.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
