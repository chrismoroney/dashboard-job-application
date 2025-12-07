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
  const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID || "demo-user";

  const fetchApplications = async () => {
    setLoading(true);
    setError(undefined);
    const query = supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data, error } = await query;

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
    fetchApplications();
  }, []);

  const addApplication = async (app: Omit<JobApplication, "id" | "createdAt">) => {
    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_title: app.jobTitle,
        company: app.company,
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
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      setError(error.message);
      return;
    }

    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
  };

  const deleteApplication = async (id: string) => {
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
    const payload: Record<string, unknown> = {};
    if (app.jobTitle !== undefined) payload.job_title = app.jobTitle;
    if (app.company !== undefined) payload.company = app.company;
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
