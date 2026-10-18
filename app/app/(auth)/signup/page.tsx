"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music2, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BackButton } from "@/components/ui/BackButton";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("Guitar");
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

      if (authError) {
        throw authError;
      }

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
      <div className="section min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md card flex flex-col items-center text-center gap-4 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-success)]/10 text-[var(--color-success)]">
            <CheckCircle size={24} />
          </div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
            Check Your Email
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            We sent a verification link to <strong className="text-[var(--color-text)]">{email}</strong>. Please confirm your email to activate your club membership.
          </p>
          <Link
            href="/login"
            className="mt-2 text-sm text-[var(--color-accent)] hover:underline font-semibold"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-md">
        <BackButton href="/" label="Home" />
      </div>
      <div className="w-full max-w-md card flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Music2 size={24} />
          </div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
            Join Saarang Club
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Register your profile to coordinate practice and rehearsals.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-[var(--radius-sm)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)]">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-muted)]">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

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
              Password (min 6 chars)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-muted)]">
              Primary Instrument
            </label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="Electric Guitar">Electric Guitar</option>
              <option value="Acoustic Guitar">Acoustic Guitar</option>
              <option value="Bass Guitar">Bass Guitar</option>
              <option value="Acoustic Drums">Acoustic Drums</option>
              <option value="Piano / Keyboard">Piano / Keyboard</option>
              <option value="Vocals">Vocals</option>
              <option value="Electronic Production">Electronic Production</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registering…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-accent)] hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

