"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  /** Override the default browser-back behaviour with a specific href */
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
      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors group cursor-pointer"
    >
      <ArrowLeft
        size={15}
        className="transition-transform group-hover:-translate-x-0.5"
      />
      {label}
    </button>
  );
}

