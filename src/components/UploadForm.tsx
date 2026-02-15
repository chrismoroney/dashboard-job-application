"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FileUploader from "./FileUploader";
import { ApplicationStatus, useApplications } from "./ApplicationsProvider";
import { supabase } from "../lib/supabaseClient";

const statusOptions: ApplicationStatus[] = ["Submitted", "Interviewing", "Accepted", "Rejected"];

const statusStyles: Record<ApplicationStatus, string> = {
  Submitted: "bg-sky-500/20 text-sky-100 ring-1 ring-sky-400/40",
  Interviewing: "bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/40",
  Accepted: "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/40",
  Rejected: "bg-rose-500/20 text-rose-100 ring-1 ring-rose-400/40",
};

export default function UploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { applications, addApplication, updateApplication } = useApplications();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<ApplicationStatus>("Submitted");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingMaterials, setExistingMaterials] = useState<{ name: string; url?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };

    loadUser();

    if (!editId) return;
    const existing = applications.find((app) => app.id === editId);
    if (existing) {
      setJobTitle(existing.jobTitle);
      setCompany(existing.company);
      setLocation(existing.location || "");
      setDate(existing.date || new Date().toISOString().split("T")[0]);
      setStatus(existing.status);
      setNotes(existing.notes || "");
      setExistingMaterials(existing.materials || []);
      return;
    }
    // fallback fetch in case not in state yet
    const fetchOne = async () => {
      const { data } = await supabase.from("applications").select("*").eq("id", editId).single();
      if (data) {
        setJobTitle(data.job_title);
        setCompany(data.company);
        setLocation(data.location || "");
        setDate(data.applied_date || new Date().toISOString().split("T")[0]);
        setStatus(data.status);
        setNotes(data.notes || "");
        setExistingMaterials(Array.isArray(data.materials) ? data.materials : []);
      }
    };
    void fetchOne();
  }, [editId, applications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  const submitForm = async () => {
    setSubmitting(true);
    setError(null);

    if (!userId) {
      setError("You must be logged in to submit an application.");
      setSubmitting(false);
      return;
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "materials";
    if (!bucket) {
      setError("No storage bucket configured. Set NEXT_PUBLIC_SUPABASE_BUCKET in .env.local.");
      setSubmitting(false);
      return;
    }

    const materials = [];

    const sanitizeFileName = (name: string) => {
      const lastDotIndex = name.lastIndexOf(".");
      const base = lastDotIndex > 0 ? name.slice(0, lastDotIndex) : name;
      const ext = lastDotIndex > 0 ? name.slice(lastDotIndex) : "";
      const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, "_");
      const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "");
      return `${safeBase}${safeExt}` || "file";
    };

    for (const file of files) {
      const safeName = sanitizeFileName(file.name);
      const path = `uploads/${userId}/${crypto.randomUUID?.() ?? Date.now()}-${safeName}`;
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      materials.push({ name: file.name, url: publicUrlData.publicUrl });
    }

    if (editId) {
      const updatedMaterials = [...existingMaterials, ...materials];
      const updated = await updateApplication(editId, {
        jobTitle,
        company,
        location,
        date,
        status,
        notes,
        materials: updatedMaterials,
      });
      if (!updated) {
        setError("Could not update application. Please try again.");
        setSubmitting(false);
        return;
      }
    } else {
      const saved = await addApplication({
        jobTitle,
        company,
        location,
        date,
        status,
        notes,
        materials: materials.length > 0 ? materials : [],
      });

      if (!saved) {
        setError("Could not save application. Please try again.");
        setSubmitting(false);
        return;
      }
    }

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{editId ? "Edit Application" : "Upload Application"}</h2>
        <p className="text-sm text-slate-300">
          {editId
            ? "Update the details or add new materials. Existing files will stay unless you replace them."
            : "Add a role, attach your materials, and set the status to keep your tracker aligned."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-100">Job Title</label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Frontend Engineer"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-100">Company</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Acme Corp"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-100">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Seattle, WA"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-100">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-100">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  status === option
                    ? `${statusStyles[option]} shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]`
                    : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      option === "Submitted"
                        ? "bg-sky-400"
                        : option === "Interviewing"
                        ? "bg-amber-400"
                        : option === "Accepted"
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                    }`}
                  />
                  {option}
                </span>
                {status === option && <span className="text-xs text-white/80">Selected</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-100">Notes / Materials</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="List materials (resume.pdf, cover_letter.docx) or add quick notes"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
      </div>

      {existingMaterials.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-100">Existing materials</p>
          <div className="flex flex-wrap gap-2">
            {existingMaterials.map((mat, idx) => (
              <a
                key={`${mat.name}-${idx}`}
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-100 border border-white/10 hover:border-cyan-300/70 hover:text-cyan-100 transition"
              >
                {mat.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <FileUploader onFilesSelected={(newFiles) => setFiles(newFiles)} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : editId ? "Save Changes" : "Submit Upload"}
        </button>
        {error && <span className="text-sm font-semibold text-rose-200">{error}</span>}
      </div>
    </form>
  );
}
