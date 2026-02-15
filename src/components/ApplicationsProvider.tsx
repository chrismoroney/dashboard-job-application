"use client";

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export type ApplicationStatus = "Accepted" | "Rejected" | "Interviewing" | "Submitted";

export interface ApplicationMaterial {
  name: string;
  url?: string;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  date?: string;
  materials: ApplicationMaterial[];
  status: ApplicationStatus;
  notes?: string;
  createdAt?: string;
}

interface ApplicationsContextValue {
  applications: JobApplication[];
  loading: boolean;
  error?: string;
  addApplication: (app: Omit<JobApplication, "id" | "createdAt">) => Promise<JobApplication | null>;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  updateApplication: (
    id: string,
    app: Partial<Omit<JobApplication, "id" | "createdAt">>
  ) => Promise<JobApplication | null>;
  refresh: () => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

function mapRow(row: any): JobApplication {
  return {
    id: row.id,
    jobTitle: row.job_title,
    company: row.company,
    location: row.location ?? "",
    date: row.applied_date ?? "",
    status: row.status,
    notes: row.notes ?? "",
    materials: Array.isArray(row.materials) ? row.materials : [],
    createdAt: row.created_at,
  };
}

export default function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchApplications = async (activeUserId?: string | null) => {
    const resolvedUserId = activeUserId ?? userId;
    if (!resolvedUserId) {
      setApplications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(undefined);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", resolvedUserId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const mapped = (data ?? []).map(mapRow);
    setApplications(mapped);
    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const resolvedUserId = data.user?.id ?? null;
      setUserId(resolvedUserId);
      await fetchApplications(resolvedUserId);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      const resolvedUserId = session?.user?.id ?? null;
      setUserId(resolvedUserId);
      void fetchApplications(resolvedUserId);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const addApplication = async (app: Omit<JobApplication, "id" | "createdAt">) => {
    if (!userId) {
      setError("You must be logged in to add applications.");
      return null;
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_title: app.jobTitle,
        company: app.company,
        location: app.location ?? "",
        applied_date: app.date ?? null,
        status: app.status,
        notes: app.notes ?? "",
        materials: app.materials ?? [],
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    const mapped = mapRow(data);
    setApplications((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    console.log("Updating status", { id, status });
    // optimistic UI update
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Status update failed", error.message);
      setError(error.message);
      // revert on error
      await fetchApplications();
      return;
    }

    if (data) {
      const updated = mapRow(data);
      setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
    } else {
      // fallback to a full refresh if no row returned
      await fetchApplications();
    }
  };

  const deleteApplication = async (id: string) => {
    if (!userId) {
      setError("You must be logged in to delete applications.");
      return;
    }

    const { error } = await supabase.from("applications").delete().eq("id", id).eq("user_id", userId);
    if (error) {
      setError(error.message);
      return;
    }
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const updateApplication = async (
    id: string,
    app: Partial<Omit<JobApplication, "id" | "createdAt">>
  ) => {
    if (!userId) {
      setError("You must be logged in to update applications.");
      return null;
    }
    const payload: Record<string, unknown> = {};
    if (app.jobTitle !== undefined) payload.job_title = app.jobTitle;
    if (app.company !== undefined) payload.company = app.company;
    if (app.location !== undefined) payload.location = app.location;
    if (app.date !== undefined) payload.applied_date = app.date;
    if (app.status !== undefined) payload.status = app.status;
    if (app.notes !== undefined) payload.notes = app.notes;
    if (app.materials !== undefined) payload.materials = app.materials;

    const { data, error } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    const mapped = mapRow(data);
    setApplications((prev) => prev.map((row) => (row.id === id ? mapped : row)));
    return mapped;
  };

  const value = useMemo(
    () => ({
      applications,
      loading,
      error,
      addApplication,
      updateStatus,
      deleteApplication,
      updateApplication,
      refresh: fetchApplications,
    }),
    [applications, loading, error]
  );

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) {
    throw new Error("useApplications must be used within ApplicationsProvider");
  }
  return ctx;
}
