"use client";

import { useEffect, useRef, useState } from "react";
import { ApplicationStatus } from "./ApplicationsProvider";

const statusStyles: Record<ApplicationStatus, string> = {
  Accepted: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/40",
  Rejected: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/40",
  Interviewing: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40",
  Submitted: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/40",
};

const statusDot: Record<ApplicationStatus, string> = {
  Accepted: "bg-emerald-400",
  Rejected: "bg-rose-400",
  Interviewing: "bg-amber-400",
  Submitted: "bg-sky-400",
};

interface StatusDropdownProps {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
}

export default function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-44 items-center justify-between rounded-full px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${statusStyles[value]}`}
      >
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusDot[value]}`} />
          {value}
        </span>
        <span aria-hidden className="text-xs text-white/80">▼</span>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-2xl bg-slate-900/95 ring-1 ring-white/10 shadow-lg backdrop-blur-xl">
          {(["Accepted", "Interviewing", "Submitted", "Rejected"] as ApplicationStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${statusDot[status]}`} />
              <span className="flex-1">{status}</span>
              {status === value && <span className="text-xs text-slate-200">Selected</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
