"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Music2, LogOut, User } from "lucide-react";
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
    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[var(--font-display)] text-lg font-bold tracking-tight text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Music2 size={20} className="text-[var(--color-accent)]" />
          <span className="font-display">Saarang</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${
                pathname === href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                <User size={14} className="text-[var(--color-accent)]" />
                {displayName}
              </span>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-1.5 h-9 rounded-[var(--radius-full)] border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <LogOut size={13} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-[var(--radius-full)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors"
              >
                Join Club
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${
                pathname === href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <hr className="border-[var(--color-border)]" />
          {user ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                <User size={14} className="text-[var(--color-accent)]" />
                {displayName}
              </span>
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                disabled={signingOut}
                className="inline-flex items-center gap-1.5 h-9 rounded-[var(--radius-full)] border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <LogOut size={13} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-background)]"
              >
                Join Club
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
