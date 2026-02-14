"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type AuthGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function AuthGuard({ children, redirectTo = "/" }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!data.session) {
        router.replace(redirectTo);
        return;
      }

      setIsChecking(false);
    };

    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.replace(redirectTo);
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [redirectTo, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-12 flex items-center justify-center">
        <div className="text-slate-200 text-sm uppercase tracking-[0.3em]">Checking session</div>
      </div>
    );
  }

  return <>{children}</>;
}
