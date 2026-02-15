import JobApplicationTracker from "../../components/JobApplicationTracker";
import LinkButton from "../../components/LinkButton";
import AuthGuard from "../../components/AuthGuard";
import SignOutButton from "../../components/SignOutButton";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Dashboard</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Job Application Tracker</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LinkButton href="/upload" label="Go to Uploads" sublabel="Add a new role" />
              <SignOutButton variant="danger" />
            </div>
          </div>
          <JobApplicationTracker />
        </div>
      </main>
    </AuthGuard>
  );
}
