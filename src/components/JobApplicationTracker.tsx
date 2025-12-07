"use client";

import { motion } from "framer-motion";
import StatusDropdown from "./StatusDropdown";
import { useApplications } from "./ApplicationsProvider";

export default function JobApplicationTracker() {
  const { applications, updateStatus, loading, error } = useApplications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
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
          className="overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-900/50"
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
