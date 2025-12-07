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

  const fetchApplications = async () => {
    setLoading(true);
    setError(undefined);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
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
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
  };

  const value = useMemo(
    () => ({
      applications,
      loading,
      error,
      addApplication,
      updateStatus,
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
