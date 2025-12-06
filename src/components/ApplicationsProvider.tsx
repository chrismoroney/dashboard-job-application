"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type ApplicationStatus = "Accepted" | "Rejected" | "Interviewing" | "Submitted";

export interface ApplicationMaterial {
  name: string;
  url?: string;
}

export interface JobApplication {
  id: number;
  jobTitle: string;
  company: string;
  materials: ApplicationMaterial[];
  status: ApplicationStatus;
}

interface ApplicationsContextValue {
  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, "id">) => void;
  updateStatus: (id: number, status: ApplicationStatus) => void;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

const initialApplications: JobApplication[] = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "Tech Solutions Inc.",
    materials: [
      { name: "resume.pdf" },
      { name: "cover_letter.docx" },
    ],
    status: "Interviewing",
  },
  {
    id: 2,
    jobTitle: "UX/UI Designer",
    company: "Creative Minds LLC",
    materials: [
      { name: "portfolio.pdf" },
      { name: "resume.pdf" },
    ],
    status: "Submitted",
  },
  {
    id: 3,
    jobTitle: "Backend Engineer",
    company: "Data Systems Co.",
    materials: [{ name: "resume.pdf" }],
    status: "Rejected",
  },
  {
    id: 4,
    jobTitle: "Product Manager",
    company: "Innovate Now",
    materials: [
      { name: "resume.pdf" },
      { name: "cover_letter.pdf" },
    ],
    status: "Accepted",
  },
];

export default function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);

  const addApplication = (app: Omit<JobApplication, "id">) => {
    setApplications((prev) => [
      { ...app, id: Date.now() },
      ...prev,
    ]);
  };

  const updateStatus = (id: number, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
  };

  const value = useMemo(
    () => ({
      applications,
      addApplication,
      updateStatus,
    }),
    [applications]
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
