"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-cream)] transition-all group cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-ivory)] px-3 py-1.5 bg-[var(--color-surface)] shadow-[2px_2px_0_0_var(--color-ink)] hover:shadow-[3px_3px_0_0_var(--color-rust)] hover:-translate-x-0.5 hover:-translate-y-0.5"
    >
      <ArrowLeft
        size={13}
        className="text-[var(--color-ochre)] transition-transform group-hover:-translate-x-1"
      />
      <span>{label}</span>
    </button>
  );
}
