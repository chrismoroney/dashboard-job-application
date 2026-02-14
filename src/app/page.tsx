"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const action = isSignUp
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });

    const { data, error } = await action;

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.session && isSignUp) {
      setStatusMessage("Check your email to confirm your account.");
      setIsLoading(false);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-12">
      <div className="max-w-5xl mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-900/50"
        >
          <div className="bg-gradient-to-r from-indigo-500/20 via-cyan-400/20 to-emerald-400/20 h-1 w-full rounded-t-3xl" />
          <div className="p-8 sm:p-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-3"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Welcome back</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {isSignUp ? "Create your account" : "Log in to your dashboard"}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Track every role, keep materials organized, and stay ahead of interviews.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? "signup" : "login"}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    required
                  />
                </motion.div>
                {errorMessage && (
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    {errorMessage}
                  </motion.div>
                )}
                {statusMessage && (
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100"
                  >
                    {statusMessage}
                  </motion.div>
                )}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Working..." : isSignUp ? "Create account" : "Log in"}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col gap-3 text-center text-sm text-slate-300"
            >
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={() => setIsSignUp((value) => !value)}
                className="text-cyan-200 hover:text-cyan-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
