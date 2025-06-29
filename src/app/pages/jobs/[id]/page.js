// src/pages/jobs/[id]/page.js
import Head from 'next/head';

export default async function JobPage({ params }) {
  const{ id } = await params;
  return <h1>Job: {id}</h1>;
}