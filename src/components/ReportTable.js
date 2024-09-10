import { useTheme } from '@emotion/react';
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

const ReportTable = ({ section, reports = [] }) => {
    const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext);
  const userId = userData?._id;

  
  const filteredReports = Array.isArray(reports) 
    ? reports.filter((report) => {
        ///console.log("Report section:", report.section); // Log report's section
        
        return report.section === section;
      })
    : [];
  
  
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 p-2">{section}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Publisher</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                <td className="border p-2">{report.userId}</td>
                <td className="border p-2">{report.publisher}</td>
                <td className="border p-2">{report.name}</td>
                <td className="border p-2">{report.email}</td>
                <td className="border p-2">{report.phone}</td>
                <td className="border p-2">{report.status}</td>
                <td className="border p-2">{new Date(report.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No reports found for {section}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
