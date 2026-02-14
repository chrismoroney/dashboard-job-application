import UploadForm from "./UploadForm";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 uppercase tracking-[0.2em]">Upload</span>
            <SignOutButton variant="danger" />
          </div>
        </div>

        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Uploads</p>
          <h1 className="text-4xl font-black text-white sm:text-5xl">Upload Page</h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Drop in your resume and cover letters, set the status, and keep your dashboard organized.
          </p>
        </header>

        <UploadForm />
      </div>
    </div>
  );
}
