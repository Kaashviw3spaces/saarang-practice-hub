"use client";

import { useEffect, useState } from "react";
import { BookingCard } from "@/components/bookings/BookingCard";
import { SessionReminderTimer } from "@/components/reminders/SessionReminderTimer";
import { type Booking, type Room } from "@/types";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
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
  available: "Free now",
  reserved: "Reserved",
  occupied: "In session",
  departure_pending: "Finishing up",
  occupancy_uncertain: "Status unclear",
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

        // Fetch user's bookings
        const { data: bData } = await supabase
          .from("bookings")
          .select("*, rooms(name)")
          .eq("user_id", user.id)
          .order("starts_at", { ascending: true });

        if (bData) {
          const mapped: Booking[] = (bData as BookingRow[]).map((row) => ({
            id: row.id,
            roomId: row.room_id,
            roomName: row.rooms?.name ?? "Unknown Session",
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

      // Fetch live room statuses
      const { data: rData } = await supabase
        .from("rooms")
        .select("name, status")
        .order("name");

      if (rData && rData.length > 0) {
        setRoomsSummary(
          rData.map((r) => ({
            room: r.name,
            status: r.status as Room["status"],
            note: STATUS_LABEL[r.status as Room["status"]] || "Available",
          }))
        );
      } else {
        // Fallback default status items if table has not been populated
        setRoomsSummary([
          { room: "Session A", status: "available", note: "Free now" },
          { room: "Session B", status: "occupied", note: "In session" },
          { room: "Jam Session", status: "reserved", note: "Reserved" },
          { room: "Recording Session", status: "departure_pending", note: "Finishing up" },
          { room: "Electronics Corner", status: "occupancy_uncertain", note: "Status unclear" },
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
    <div className="section">
      <div className="container flex flex-col gap-10">
        {/* Back navigation */}
        <BackButton href="/" label="Home" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-1">
              Welcome back, {userName}
            </p>
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Your Dashboard
            </h1>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 h-10 rounded-[var(--radius-full)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            <Plus size={15} /> Book a Session
          </Link>
        </div>

        {/* Quick-action cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Book Slot", href: "/book", planned: false },
            { icon: CheckCircle2, label: "Check In", href: "/checkin", planned: false },
            { icon: Clock, label: "Extend", href: "#", planned: true },
            { icon: Bell, label: "Reminders", href: "#", planned: true },
          ].map(({ icon: Icon, label, href, planned }) => (
            <Link
              key={label}
              href={href}
              className="card flex flex-col items-center gap-3 py-6 hover:border-[var(--color-accent)]/40 transition-all text-center group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/15 transition-colors">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
                {planned && (
                  <p className="text-[10px] text-[var(--color-accent)] mt-0.5">[planned]</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Live Active Session Timer & Reminders */}
        <SessionReminderTimer
          initialMinutes={activeTimerMinutes}
          sessionName={
            upcoming.length > 0
              ? `${upcoming[0].roomName} (${upcoming[0].instrument})`
              : "Session A (Practice Demo)"
          }
        />

        {/* Main two-column grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Bookings */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Upcoming */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Calendar size={16} className="text-[var(--color-accent)]" />
                  Upcoming Sessions
                </h2>
                <Link
                  href="/bookings"
                  className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-0.5"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12 gap-2 text-[var(--color-text-muted)] text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Loading sessions…
                </div>
              ) : upcoming.length === 0 ? (
                <div className="card text-center py-10 text-[var(--color-text-muted)] text-sm">
                  {isLoggedIn ? (
                    <>
                      No upcoming bookings.{" "}
                      <Link href="/book" className="text-[var(--color-accent)] hover:underline">
                        Book a slot →
                      </Link>
                    </>
                  ) : (
                    <>
                      Sign in to view your bookings.{" "}
                      <Link href="/login" className="text-[var(--color-accent)] hover:underline">
                        Sign in →
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcoming.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent */}
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Clock size={16} className="text-[var(--color-accent)]" />
                Recent Sessions
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-[var(--color-text-muted)] text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Loading…
                </div>
              ) : recent.length === 0 ? (
                <div className="card text-center py-6 text-[var(--color-text-muted)] text-sm">
                  No previous sessions on record.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recent.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Session status + notifications */}
          <div className="flex flex-col gap-6">
            {/* Session status */}
            <div className="card flex flex-col gap-4">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Music2 size={16} className="text-[var(--color-accent)]" />
                Session Status
              </h2>
              <div className="flex flex-col gap-3">
                {roomsSummary.map(({ room, status, note }) => (
                  <div key={room} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
                      <span className="text-sm text-[var(--color-text)] truncate">{room}</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)] shrink-0">{note}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/rooms"
                className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-0.5 mt-1"
              >
                Full session view <ArrowRight size={11} />
              </Link>
            </div>

            {/* Notifications card */}
            <div className="card flex flex-col gap-4">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Bell size={16} className="text-[var(--color-accent)]" />
                Notifications
              </h2>
              <div className="flex flex-col gap-2">
                <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 flex flex-col gap-0.5">
                  <p className="text-sm text-[var(--color-text)]">Practice Hub connected to Supabase</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Live session sync active</p>
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-dim)]">
                Push notifications coming in Milestone 6
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
