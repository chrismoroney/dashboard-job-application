"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

type ApplicationStatus = "Accepted" | "Rejected" | "Interviewing" | "Submitted";

interface JobApplication {
  id: number;
  jobTitle: string;
  company: string;
  materials: string[];
  status: ApplicationStatus;
}

const initialApplications: JobApplication[] = [
  { id: 1, jobTitle: "Frontend Developer", company: "Tech Solutions Inc.", materials: ["resume.pdf", "cover_letter.docx"], status: "Interviewing" },
  { id: 2, jobTitle: "UX/UI Designer", company: "Creative Minds LLC", materials: ["portfolio.pdf", "resume.pdf"], status: "Submitted" },
  { id: 3, jobTitle: "Backend Engineer", company: "Data Systems Co.", materials: ["resume.pdf"], status: "Rejected" },
  { id: 4, jobTitle: "Product Manager", company: "Innovate Now", materials: ["resume.pdf", "cover_letter.pdf"], status: "Accepted" },
];

const statusStyles: { [key in ApplicationStatus]: string } = {
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Interviewing: "bg-yellow-100 text-yellow-800",
  Submitted: "bg-blue-100 text-blue-800",
};

export default function JobApplicationTracker() {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-gray-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Job Application Tracker
        </motion.h1>
        <motion.div 
          className="overflow-x-auto bg-white rounded-2xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900">Job Title</th>
                <th scope="col" className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900">Company</th>
                <th scope="col" className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900">Materials</th>
                <th scope="col" className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app, index) => (
                <motion.tr 
                  key={app.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900">{app.jobTitle}</td>
                  <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500">{app.company}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-2">
                      {app.materials.map((material, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {material}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 px-6 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
