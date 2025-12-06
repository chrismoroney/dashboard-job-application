"use client";

import Link from "next/link";

interface LinkButtonProps {
  href: string;
  label: string;
  sublabel?: string;
}

export default function LinkButton({ href, label, sublabel }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      <span>{label}</span>
      {sublabel && <span className="text-xs text-white/80">{sublabel}</span>}
      <span aria-hidden className="text-white/80">→</span>
    </Link>
  );
}
