// src/index.js
import Head from 'next/head';
import Table from './../components/Table';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Job Application Tracker</title>
      </Head>

      <h1 className="text-3xl font-bold mb-4">Job Applications</h1>

      <Table />
    </div>
  );
}

export default Home;