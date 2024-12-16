import React, { useContext } from 'react';
import { UserContext } from '../context/userContext.js';

const ApplyTable = ({ section, apply = [] ,reports=[]}) => {
  console.log("Reports ",reports)

  const { userData,localhosturl } = useContext(UserContext);
  const userId = userData?._id;

 
  const filteredApply = Array.isArray(apply) 
    ? apply.filter((report) => {
       // Log report's section
        return report.section.trim().toLowerCase() === section.trim().toLowerCase();

       // return report.section === section;
      })
    : [];
    const filteredReports = Array.isArray(reports) 
    ? reports.filter((report) => {
        console.log("Report section:", report.section,section,report.section === section); 
        return report.section.trim().toLowerCase() === section.trim().toLowerCase();

       // return report.section === section;
      })
    : [];
    

  
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 p-2">{section}</h3>
      <div>
      <h4>Application Data</h4>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">User ID</th>
            <th className="border p-2">publisherId</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredApply.length > 0 ? (
            filteredApply.map((report) => {
             
              return(
              <tr key={report._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                <td className="border p-2">{report.userId}</td>
                <td className="border p-2">{report.publisherId}</td>
                <td className="border p-2">{report.name}</td>
                <td className="border p-2">{report.email}</td>
                <td className="border p-2">{report.phone}</td>
                <td className="border p-2">{report.status}</td>
                <td className="border p-2">{new Date(report.createdAt).toLocaleString()}</td>
              </tr>
            )})
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No apply found for {section}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <div>
      <h4>Report Data</h4>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">User ID</th>
            <th className="border p-2">publisherId</th>
            <th className="border p-2">Report Type</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Details</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              console.log("Rendering report:", report)
              return(
              <tr key={report._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                <td className="border p-2">{report.userId}</td>
                <td className="border p-2">{report.publisherId}</td>
                <td className="border p-2">{report.reportType}</td>
                <td className="border p-2">{report.reason}</td>
                <td className="border p-2">{report.details}</td>
                <td className="border p-2">{report.status}</td>
                <td className="border p-2">{new Date(report.createdAt).toLocaleString()}</td>
              </tr>
            )})
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No apply found for {section}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

    </div>
  );
};

export default ApplyTable;
