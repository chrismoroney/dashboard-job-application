"use client";

import { motion } from "framer-motion";
import StatusDropdown from "./StatusDropdown";
import { useApplications } from "./ApplicationsProvider";
import ConfirmDialog from "./ConfirmDialog";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JobApplicationTracker() {
  const router = useRouter();
  const { applications, updateStatus, deleteApplication, loading, error } = useApplications();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-12">
      <div className="max-w-screen-2xl w-full mx-auto space-y-10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Applications
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow">
            Job Application Tracker
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Keep an eye on every role, toggle statuses quickly, and stay ahead of your interview pipeline.
          </p>
        </motion.div>

        <motion.div
          className="overflow-visible rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-900/50"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {error && (
            <div className="bg-rose-500/10 text-rose-100 border border-rose-500/30 px-4 py-3 text-sm">
              Failed to load applications: {error}
            </div>
          )}
          <div className="bg-gradient-to-r from-indigo-500/20 via-cyan-400/20 to-emerald-400/20 h-1 w-full" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Job Title</th>
                  <th scope="col" className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Company</th>
                  <th scope="col" className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Materials</th>
                  <th scope="col" className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Status</th>
                  <th scope="col" className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-200"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading && (
                  <tr>
                    <td colSpan={4} className="py-6 px-6 text-center text-slate-200 text-sm">
                      Loading applications...
                    </td>
                  </tr>
                )}
                {!loading && applications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 px-6 text-center text-slate-200 text-sm">
                      No applications yet. Add one from the Upload page.
                    </td>
                  </tr>
                )}
                {applications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="whitespace-nowrap py-4 px-6 text-sm font-semibold text-white">{app.jobTitle}</td>
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-slate-200">{app.company}</td>
                    <td className="py-4 px-6 text-sm text-slate-200">
                      <div className="flex flex-wrap gap-2">
                        {app.materials.map((material, i) => (
                          material.url ? (
                            <a
                              key={`${material.name}-${i}`}
                              href={material.url}
                              download={material.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-100 border border-white/10 hover:border-cyan-300/70 hover:text-cyan-100 transition"
                            >
                              {material.name}
                            </a>
                          ) : (
                            <span
                              key={`${material.name}-${i}`}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-100 border border-white/10"
                            >
                              {material.name}
                            </span>
                          )
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 px-6 text-sm">
                      <StatusDropdown value={app.status} onChange={(status) => updateStatus(app.id, status)} />
                    </td>
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-right">
                      <MenuButton
                        onEdit={() => {
                          router.push(`/upload?id=${app.id}`);
                        }}
                        onDelete={() => setPendingDelete(app.id)}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete application?"
        description="This will remove the job application and its links. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete) {
            await deleteApplication(pendingDelete);
            setPendingDelete(null);
          }
        }}
      />
    </div>
  );
}

function MenuButton({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label="More options"
      >
        ...
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-slate-900/95 ring-1 ring-white/10 shadow-xl backdrop-blur-xl z-40">
          <button
            className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-3 text-sm text-rose-200 hover:bg-white/10"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
