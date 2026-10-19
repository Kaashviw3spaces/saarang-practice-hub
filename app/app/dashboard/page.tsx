"use client";

import { useEffect, useState } from "react";
import { BookingCard } from "@/components/bookings/BookingCard";
import { SessionReminderTimer } from "@/components/reminders/SessionReminderTimer";
import { type Booking, type Room } from "@/types";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";
import { supabase } from "@/lib/supabase/client";
import {
  Music2,
  Calendar,
  Clock,
  Bell,
  Plus,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Radio,
  Sparkles,
  Ticket,
  Zap,
} from "lucide-react";

interface BookingRow {
  id: string;
  room_id: string;
  user_id: string;
  instrument: string;
  mode: Booking["mode"];
  starts_at: string;
  ends_at: string;
  status: Booking["status"];
  rooms: { name: string } | null;
}

interface RoomStatusItem {
  room: string;
  status: Room["status"];
  note: string;
}

const STATUS_DOT: Record<Room["status"], string> = {
  available: "bg-[var(--color-available)]",
  reserved: "bg-[var(--color-reserved)]",
  occupied: "bg-[var(--color-occupied)]",
  departure_pending: "bg-[var(--color-pending)]",
  occupancy_uncertain: "bg-[var(--color-uncertain)]",
};

const STATUS_LABEL: Record<Room["status"], string> = {
  available: "STAGE OPEN",
  reserved: "RESERVED",
  occupied: "IN REHEARSAL",
  departure_pending: "FINISHING UP",
  occupancy_uncertain: "STATUS UNCLEAR",
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomsSummary, setRoomsSummary] = useState<RoomStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("there");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTimerMinutes, setActiveTimerMinutes] = useState(45);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        const name =
          (user.user_metadata?.full_name as string)?.split(" ")[0] ||
          user.email?.split("@")[0] ||
          "there";
        setUserName(name);

        const { data: bData } = await supabase
          .from("bookings")
          .select("*, rooms(name)")
          .eq("user_id", user.id)
          .order("starts_at", { ascending: true });

        if (bData) {
          const mapped: Booking[] = (bData as BookingRow[]).map((row) => ({
            id: row.id,
            roomId: row.room_id,
            roomName: row.rooms?.name
              ? row.rooms.name
                  .replace(/\s*\(Acoustic\)/i, "")
                  .replace(/\s*Area/i, "")
                  .trim()
              : "Unknown Session",
            userId: row.user_id,
            memberName: name,
            instrument: row.instrument,
            mode: row.mode,
            startsAt: new Date(row.starts_at),
            endsAt: new Date(row.ends_at),
            status: row.status,
          }));
          setBookings(mapped);

          const firstUpcoming = mapped.find(
            (b) => b.status === "confirmed" || b.status === "pending"
          );
          if (firstUpcoming) {
            const diff = Math.max(
              1,
              Math.round((firstUpcoming.endsAt.getTime() - Date.now()) / 60000)
            );
            setActiveTimerMinutes(diff);
          }
        }
      }

      try {
        const res = await fetch("/api/rooms", { cache: "no-store" });
        const json = await res.json();
        const seedRooms: Room[] = json.rooms ?? [];

        const { data: rData } = await supabase
          .from("rooms")
          .select("name, status")
          .order("name");

        const statusMap = new Map<string, Room["status"]>();
        if (rData) {
          for (const item of rData) {
            statusMap.set(item.name.toLowerCase().trim(), item.status as Room["status"]);
          }
        }

        const summary: RoomStatusItem[] = seedRooms.map((r) => {
          const status = statusMap.get(r.name.toLowerCase().trim()) || r.status;
          return {
            room: r.name,
            status,
            note: STATUS_LABEL[status] || "STAGE OPEN",
          };
        });

        setRoomsSummary(
          summary.length > 0
            ? summary
            : [
                { room: "Session A", status: "available", note: "STAGE OPEN" },
                { room: "Session B", status: "occupied", note: "IN REHEARSAL" },
                { room: "Jam Session", status: "reserved", note: "RESERVED" },
                { room: "Recording Session", status: "departure_pending", note: "FINISHING UP" },
              ]
        );
      } catch {
        setRoomsSummary([
          { room: "Session A", status: "available", note: "STAGE OPEN" },
          { room: "Session B", status: "occupied", note: "IN REHEARSAL" },
          { room: "Jam Session", status: "reserved", note: "RESERVED" },
          { room: "Recording Session", status: "departure_pending", note: "FINISHING UP" },
        ]);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const recent = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <div className="section min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
      {/* Rolling Stones Santiago Chile burgundy swirl background */}
      <PosterBackdrop variant="dashboard" overlayOpacity={0.3} />

      <div className="container relative z-10 flex flex-col gap-10">
        {/* Back navigation */}
        <div>
          <BackButton href="/" label="Home" />
        </div>

        {/* Dashboard Banner Header */}
        <div className="p-8 border border-[var(--color-ivory)]/40 bg-[var(--color-surface)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25)] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-tour badge-tour-accent">
                <Radio size={12} /> BACKSTAGE ACCESS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                ARTIST CONTROL PANEL
              </span>
            </div>
            <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
              WELCOME BACK, {userName.toUpperCase()}
            </h1>
            <p className="mt-2 text-sm md:text-base text-[var(--color-text-muted)] max-w-xl leading-relaxed poster-subhead">
              Track live countdowns, room occupancy, and manage your booked rehearsal sessions.
            </p>
          </div>

          <Link
            href="/book"
            className="btn-rock-primary text-sm py-2.5 px-6 shadow-[3px_3px_0_0_var(--color-rust)] shrink-0 self-start sm:self-auto"
          >
            <Plus size={15} /> Book a Slot
          </Link>
        </div>

        {/* Quick-action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Book Slot", href: "/book", planned: false },
            { icon: Radio, label: "Acoustic AI", href: "/compatibility", planned: false },
            { icon: Clock, label: "Extend Session", href: "#", planned: true },
            { icon: Bell, label: "Reminders", href: "#", planned: true },
          ].map(({ icon: Icon, label, href, planned }) => (
            <Link
              key={label}
              href={href}
              className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-ivory)] transition-all flex flex-col items-center text-center gap-3 shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.15)] hover:shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_4px_var(--color-cream),0_8px_20px_rgba(0,0,0,0.5)] hover:-translate-y-1 group"
            >
              <div className="flex h-11 w-11 items-center justify-center bg-[var(--color-ink)] text-[var(--color-ochre)] border border-[var(--color-border)] group-hover:bg-[var(--color-cream)] group-hover:text-[var(--color-ink)] transition-colors">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-[var(--font-display)] text-lg uppercase tracking-wider text-[var(--color-cream)] leading-none">
                  {label}
                </p>
                {planned && (
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-rust)] mt-1">
                    [planned]
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Live Active Session Stage Clock */}
        <SessionReminderTimer
          initialMinutes={activeTimerMinutes}
          sessionName={
            upcoming.length > 0
              ? `${upcoming[0].roomName} (${upcoming[0].instrument})`
              : "Session A (Demo Rehearsal)"
          }
        />

        {/* Two-Column Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Bookings */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Upcoming */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                  <Calendar size={18} className="text-[var(--color-ochre)]" />
                  UPCOMING REHEARSALS
                </h2>
                <Link
                  href="/bookings"
                  className="text-xs font-mono uppercase tracking-wider text-[var(--color-ochre)] hover:underline flex items-center gap-1"
                >
                  View all ({bookings.length}) <ArrowRight size={12} />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12 gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-widest">
                  <Loader2 size={16} className="animate-spin text-[var(--color-ochre)]" />
                  Loading stage sessions…
                </div>
              ) : upcoming.length === 0 ? (
                <div className="p-8 text-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider">
                  {isLoggedIn ? (
                    <>
                      No upcoming rehearsals booked.{" "}
                      <Link href="/book" className="text-[var(--color-ochre)] hover:underline ml-1">
                        Book a slot now →
                      </Link>
                    </>
                  ) : (
                    <>
                      Sign in to view your rehearsal schedule.{" "}
                      <Link href="/login" className="text-[var(--color-ochre)] hover:underline ml-1">
                        Sign In →
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                  <Clock size={18} className="text-[var(--color-rust)]" />
                  RECENT ARCHIVED SETS
                </h2>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-widest">
                  <Loader2 size={16} className="animate-spin" />
                  Loading…
                </div>
              ) : recent.length === 0 ? (
                <div className="p-6 text-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider">
                  No previous sessions on record.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {recent.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stage Radar & Backstage Bulletin */}
          <div className="flex flex-col gap-6">
            {/* Live Stage Status Radar */}
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.15)] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h2 className="font-[var(--font-display)] text-xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                  <Music2 size={16} className="text-[var(--color-ochre)]" />
                  SLOT RADAR
                </h2>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-available)] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-available)] animate-pulse" /> LIVE
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {roomsSummary.map(({ room, status, note }, idx) => (
                  <div
                    key={`${room}-${idx}`}
                    className="flex items-center justify-between gap-2 p-2.5 bg-[var(--color-ink)] border border-[var(--color-border)] text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
                      <span className="text-[var(--color-cream)] truncate font-medium">
                        {room}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] shrink-0">
                      {note}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/rooms"
                className="btn-rock-ghost text-xs py-2 text-center justify-center mt-2"
              >
                Full Stage Directory <ArrowRight size={12} />
              </Link>
            </div>

            {/* Backstage Bulletin */}
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.15)] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h2 className="font-[var(--font-display)] text-xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                  <Bell size={16} className="text-[var(--color-magenta)]" />
                  BULLETIN BOARD
                </h2>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                  DISPATCH
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-3 flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ochre)]">
                    ROOM PROTOCOL
                  </span>
                  <p className="text-xs font-mono text-[var(--color-cream)]">
                    Supabase slot sensors online. Real-time availability synchronized.
                  </p>
                  <p className="text-[10px] font-mono text-[var(--color-text-dim)]">
                    System Telemetry · Connected
                  </p>
                </div>
                <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-3 flex flex-col gap-1 opacity-70">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-rust)]">
                    EQUIPMENT UPDATE
                  </span>
                  <p className="text-xs font-mono text-[var(--color-text-muted)]">
                    New drum set now available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
