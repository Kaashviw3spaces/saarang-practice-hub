"use client";

import { RoomCard } from "@/components/rooms/RoomCard";
import { type Room } from "@/types";
import { Filter, Search } from "lucide-react";

/* Placeholder data — replaced with Supabase in Milestone 3 */
const ALL_ROOMS: Room[] = [
  {
    id: "r1",
    name: "Studio A",
    description: "Fully soundproofed rehearsal room with professional mixing desk, drum kit, and PA system.",
    capacity: 6,
    status: "available",
    equipment: ["Drum Kit", "PA System", "Bass Amp", "Guitar Amp", "Mixing Desk", "Vocal Mics"],
    acousticProperties: "Fully isolated — suitable for loud instruments and full-band rehearsals.",
  },
  {
    id: "r2",
    name: "Studio B",
    description: "Intimate practice room ideal for solo practice, duets, and acoustic or electronic sessions.",
    capacity: 3,
    status: "occupied",
    equipment: ["Upright Piano", "Headphone Amp", "Music Stands", "Audio Interface"],
    acousticProperties: "Semi-isolated — moderate noise reduction.",
    currentBooking: {
      memberName: "Aryan K.",
      instrument: "Electric Guitar",
      mode: "individual",
      endsAt: new Date("2026-10-17T19:00:00Z"),
    },
  },
  {
    id: "r3",
    name: "Jam Room",
    description: "Open jam space for collaborative sessions and small band rehearsals.",
    capacity: 8,
    status: "reserved",
    equipment: ["Drum Kit", "Bass Amp", "Guitar Amp", "Vocal Mic", "Keyboard", "Cables"],
    acousticProperties: "Acoustic panels — good for ensemble practice.",
    nextAvailableAt: new Date("2026-10-17T19:30:00Z"),
  },
  {
    id: "r4",
    name: "Recording Booth",
    description: "Professional recording and monitoring space for vocals and acoustic instruments.",
    capacity: 2,
    status: "departure_pending",
    equipment: ["Condenser Mic", "Studio Monitors", "Audio Interface", "Pop Filter"],
    acousticProperties: "Broadcast-grade isolation — near silent.",
    currentBooking: {
      memberName: "Priya S.",
      instrument: "Vocals",
      mode: "individual",
      endsAt: new Date("2026-10-17T18:45:00Z"),
    },
  },
  {
    id: "r5",
    name: "Electronics Corner",
    description: "Dedicated space for electronic producers, synth players, and home-recording setups.",
    capacity: 2,
    status: "occupancy_uncertain",
    equipment: ["Synth (Arturia)", "MIDI Keyboard", "DAW Workstation", "Studio Headphones"],
    acousticProperties: "Open layout — suitable for headphone-only practice.",
  },
];

export default function RoomsPage() {
  return (
    <div className="section">
      <div className="container flex flex-col gap-8">
        {/* Page header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Live Status
          </p>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
            Practice Rooms
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl">
            All rooms updated in real time. Pick a room, check the current session and
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
              placeholder="Search rooms or equipment…"
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
                style={{ backgroundColor: `var(--color-${label.toLowerCase().replace(/\s+/g, "-")})`, background: color }}
              />
              {label}
            </span>
          ))}
        </div>

        {/* Room grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL_ROOMS.map((room) => (
            <RoomCard
              key={room.id}
              {...room}
              onBook={(id) => {
                // TODO: navigate to booking form in Milestone 3
                console.log("Book room", id);
              }}
            />
          ))}
        </div>

        <p className="text-xs text-[var(--color-text-dim)] text-center">
          ⚠️ Room data is placeholder until Supabase integration (Milestone 3). Booking buttons are non-functional.
        </p>
      </div>
    </div>
  );
}

