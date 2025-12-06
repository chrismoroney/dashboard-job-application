import JobApplicationTracker from "../components/JobApplicationTracker";
import LinkButton from "../components/LinkButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Job Application Tracker</h1>
          </div>
          <LinkButton href="/upload" label="Go to Uploads" sublabel="Add a new role" />
        </div>
        <JobApplicationTracker />
      </div>
    </main>
  );
}
