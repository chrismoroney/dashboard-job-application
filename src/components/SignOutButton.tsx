"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type SignOutButtonProps = {
  variant?: "default" | "danger";
};

export default function SignOutButton({ variant = "default" }: SignOutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const baseClasses =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70";
  const variantClasses =
    variant === "danger"
      ? "bg-rose-500/20 text-rose-100 shadow-rose-500/20 hover:bg-rose-500/30 focus:ring-rose-300"
      : "bg-white/10 text-white shadow-slate-900/50 hover:bg-white/15 focus:ring-cyan-300";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={`${baseClasses} ${variantClasses}`}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
