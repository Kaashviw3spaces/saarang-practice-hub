"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";

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

      if (authError) throw authError;

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
    <div className="section min-h-[85vh] bg-[var(--color-ink)] text-[var(--color-cream)] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <PosterBackdrop variant="auth" overlayOpacity={0.4} />
      <div className="w-full max-w-md relative z-10">
        <BackButton href="/" label="Home" />
      </div>

      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-ivory)]/40 shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3),0_16px_40px_rgba(0,0,0,0.7)] p-8 md:p-10 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center bg-[var(--color-ink)] border-2 border-[var(--color-cream)] text-[var(--color-cream)] shadow-[3px_3px_0_0_var(--color-rust)]">
            <Zap size={22} className="fill-current" />
          </div>
          <span className="badge-tour badge-tour-accent mt-2">MEMBER LOGIN</span>
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
            SIGN IN TO SAARANG
          </h1>
          <p className="text-xs font-mono text-[var(--color-text-muted)]">
            Access your practice slots, rehearsals, and scheduled sessions.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs font-mono border border-[var(--color-danger)] bg-[var(--color-danger)]/15 text-[var(--color-cream)]">
            <AlertCircle size={14} className="shrink-0 text-[var(--color-danger)]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)]">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="musician@saarang.club"
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] pl-10 pr-3 font-mono text-xs text-[var(--color-cream)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-ivory)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)]">
              Passphrase
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] pl-10 pr-3 font-mono text-xs text-[var(--color-cream)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-ivory)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 btn-rock-primary text-base py-3 shadow-[3px_3px_0_0_var(--color-rust)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                AUTHENTICATING…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ENTER BACKSTAGE <ArrowRight size={15} />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-4">
          Need backstage credentials?{" "}
          <Link href="/signup" className="text-[var(--color-ochre)] hover:underline font-bold">
            Join the Club →
          </Link>
        </p>
      </div>
    </div>
  );
}
