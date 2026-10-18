"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Music2, LogOut, User, Radio, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/rooms", label: "Sessions" },
  { href: "/book", label: "Book Slot" },
  { href: "/compatibility", label: "Acoustic AI" },
  { href: "/bookings", label: "Bookings" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.push("/");
  };

  const displayName = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(" ")[0]
    : user?.email?.split("@")[0] ?? "";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-ink)]/95 backdrop-blur-md">
      {/* Top hairline vintage stripe */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[var(--color-burgundy)] via-[var(--color-ochre)] to-[var(--color-rust)]" />

      <div className="container flex h-16 items-center justify-between">
        {/* Logo with vintage gig aesthetic */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center bg-[var(--color-cream)] text-[var(--color-ink)] border border-[var(--color-cream)] group-hover:bg-[var(--color-rust)] group-hover:text-[var(--color-cream)] group-hover:border-[var(--color-rust)] transition-colors">
            <Zap size={18} className="fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-[var(--font-display)] text-2xl tracking-wider text-[var(--color-cream)] leading-none">
              SAARANG
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[var(--color-ochre)] leading-none mt-0.5">
              PRACTICE HUB
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative font-mono text-xs uppercase tracking-[0.16em] transition-colors py-1 ${
                  isActive
                    ? "text-[var(--color-cream)] font-bold"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-cream)]"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-ochre)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] border border-[var(--color-border)] px-2.5 py-1 bg-[var(--color-surface)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-available)] animate-pulse" />
                {displayName}
              </span>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-1.5 font-[var(--font-display)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-cream)] border border-[var(--color-border)] hover:border-[var(--color-ivory)] px-3 py-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut size={12} />
                {signingOut ? "Exiting…" : "Sign Out"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="font-[var(--font-display)] text-sm uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-cream)] transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-rock-primary text-sm py-1.5 px-4 shadow-[3px_3px_0_0_var(--color-rust)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              >
                Join Club
              </Link>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-1.5 text-[var(--color-cream)] border border-[var(--color-border)] hover:border-[var(--color-ivory)] transition-colors cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-ink)] px-6 py-6 flex flex-col gap-4 shadow-xl">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`font-[var(--font-display)] text-lg uppercase tracking-wider transition-colors ${
                pathname === href
                  ? "text-[var(--color-ochre)]"
                  : "text-[var(--color-cream)] hover:text-[var(--color-ochre)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <hr className="border-[var(--color-border)] my-2" />
          {user ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Logged in as {displayName}
              </span>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                disabled={signingOut}
                className="btn-rock-ghost text-sm py-2 justify-center"
              >
                <LogOut size={13} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-rock-ghost text-sm py-2 justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="btn-rock-primary text-sm py-2 justify-center"
              >
                Join Club
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
