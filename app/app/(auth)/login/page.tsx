"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music2, Lock, Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md card flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Music2 size={24} />
          </div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
            Sign In to Saarang
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Access your practice slots, rehearsals, and bookings.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-[var(--radius-sm)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)]">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-muted)]">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="musician@college.edu"
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-muted)]">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[var(--color-accent)] hover:underline font-medium">
            Join the Club
          </Link>
        </p>
      </div>
    </div>
  );
}
