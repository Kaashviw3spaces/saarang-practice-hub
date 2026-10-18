"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, User, AlertCircle, CheckCircle, ArrowRight, Loader2, Music2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("Electric Guitar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            primary_instrument: instrument,
          },
        },
      });

      if (authError) throw authError;

      if (data.session) {
        router.push("/dashboard");
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during account creation.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section min-h-[85vh] bg-[var(--color-ink)] text-[var(--color-cream)] flex items-center justify-center p-4 relative overflow-hidden">
        <PosterBackdrop variant="auth" overlayOpacity={0.4} />
        <div className="w-full max-w-md bg-[var(--color-surface)] border-2 border-[var(--color-ivory)] shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3)] p-8 flex flex-col items-center text-center gap-4 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center bg-[var(--color-ink)] border-2 border-[var(--color-available)] text-[var(--color-available)]">
            <CheckCircle size={24} />
          </div>
          <span className="badge-tour badge-tour-accent">MEMBERSHIP PENDING</span>
          <h2 className="font-[var(--font-poster)] text-3xl font-normal text-[var(--color-cream)] poster-headline">
            VERIFICATION DISPATCHED
          </h2>
          <p className="text-xs font-mono text-[var(--color-text-muted)] leading-relaxed">
            We sent a verification link to <strong className="text-[var(--color-cream)]">{email}</strong>. Check your inbox
            to activate your backstage pass.
          </p>
          <Link
            href="/login"
            className="btn-rock-primary text-sm py-2 px-6 mt-2"
          >
            Back to Sign In →
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="badge-tour badge-tour-rust mt-2">NEW ARTIST ROSTER</span>
          <h1 className="font-[var(--font-poster)] text-3xl sm:text-4xl font-normal text-[var(--color-cream)] leading-none tracking-tight poster-headline">
            JOIN SAARANG CLUB
          </h1>
          <p className="text-xs font-mono text-[var(--color-text-muted)]">
            Register your profile to coordinate practice and stage rehearsals.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs font-mono border border-[var(--color-danger)] bg-[var(--color-danger)]/15 text-[var(--color-cream)]">
            <AlertCircle size={14} className="shrink-0 text-[var(--color-danger)]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)]">
              Artist Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Turner"
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] pl-10 pr-3 font-mono text-xs text-[var(--color-cream)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-ivory)]"
              />
            </div>
          </div>

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
              Passphrase (min 6 chars)
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] pl-10 pr-3 font-mono text-xs text-[var(--color-cream)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-ivory)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)]">
              Primary Instrument Setup
            </label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full h-11 bg-[var(--color-ink)] border border-[var(--color-border)] px-3 font-mono text-xs uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] cursor-pointer"
            >
              <option value="Electric Guitar" className="bg-[var(--color-ink)]">Electric Guitar</option>
              <option value="Acoustic Guitar" className="bg-[var(--color-ink)]">Acoustic Guitar</option>
              <option value="Bass Guitar" className="bg-[var(--color-ink)]">Bass Guitar</option>
              <option value="Acoustic Drums" className="bg-[var(--color-ink)]">Acoustic Drums</option>
              <option value="Piano / Keyboard" className="bg-[var(--color-ink)]">Piano / Keyboard</option>
              <option value="Vocals" className="bg-[var(--color-ink)]">Vocals</option>
              <option value="Electronic Production" className="bg-[var(--color-ink)]">Electronic Production</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 btn-rock-primary text-base py-3 shadow-[3px_3px_0_0_var(--color-rust)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                REGISTERING ARTIST…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ISSUE ARTIST PASS <ArrowRight size={15} />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-4">
          Already registered on the roster?{" "}
          <Link href="/login" className="text-[var(--color-ochre)] hover:underline font-bold">
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}
