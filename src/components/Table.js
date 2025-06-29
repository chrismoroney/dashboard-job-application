// src/components/Table.js
import Link from 'next/link';

function Table() {
  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Company A',
      status: 'Applied',
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      company: 'Company B',
      status: 'Interviewing',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Company C',
      status: 'Rejected',
    },
    // Add more job objects here...
  ];

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="bg-white">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/pages/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800">
                {job.title}
                </Link>             
             </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900">{job.company}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                {job.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;