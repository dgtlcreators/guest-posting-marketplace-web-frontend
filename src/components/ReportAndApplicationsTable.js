
import { useTheme } from '@emotion/react';
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportAndApplicationsTable = ({ section, apply = [], reports = [], filterType ,setApply,setReports}) => {
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl,addNotification } = useContext(UserContext);
  const userId = userData?._id;
  


  const filteredApply = Array.isArray(apply)
    ? apply.filter((item) => item.section.trim().toLowerCase() === section.trim().toLowerCase())
    : [];
    
  const filteredReports = Array.isArray(reports)
    ? reports.filter((item) => item.section.trim().toLowerCase() === section.trim().toLowerCase())
    : [];

    const updateStatus = async (id, type, newStatus,formData,publisherId) => {
      const url = type === 'report' ? `/reportroute/updatereport/${id}` : `/applyroute/updateapplydata/${id}`;
      try {
        await axios.put(`${localhosturl}${url}`, { status: newStatus });
       
        if (type === 'application') {
          setApply((prev) => 
            prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
          );
        } else {
          setReports((prev) => 
            prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
          );
        }
        const messageText=type === 'application'?`Application status updated to ${newStatus} for ${formData.name}.`:
         `Report status updated to ${newStatus} for report type ${formData.reportType}.`

         const notification =  await axios.post(`${localhosturl}/notificationroute/createNotifications`, {
          userId,
          publisherId, 
          section,
          status: newStatus,  
          isBookmarked: false,
          formData,
          details: {
            message: messageText//`Application status updated to ${newStatus} by ${formData.name || formData.reportType}.`,
          },
        });
        addNotification(notification);
        toast.success('Status updated successfully');
      } catch (error) {
        console.error('Error updating status', error);
        toast.error(`Failed to update status: ${error.message}`);
      }
    };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 p-2">{section}</h3>
      
     <div className='p-4'>
     {filterType === 'applications' || filterType === 'all' ? (
        <>
          <h4 className="text-xl font-semibold mb-2 p-2">Application Data</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Publisher ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredApply.length > 0 ? (
                filteredApply.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                    <td className="border p-2">{item.userId}</td>
                    <td className="border p-2">{item.publisherId}</td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.email}</td>
                    <td className="border p-2">{item.phone}</td>
                    <td className="border p-2">{item.status} - 
                      {<select
                          value={item.status}
                          onChange={(e) => updateStatus(item._id, 'application', e.target.value,item,item.publisherId)}
                          className="border rounded p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>}
                    </td>
                    <td className="border p-2">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-2 text-center">
                    No applications found for {section}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : null}

      {filterType === 'reports' || filterType === 'all' ? (
        <>
          <h4 className="text-xl font-semibold mb-2 mt-2 p-2">Report Data</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Publisher ID</th>
                <th className="border p-2">Report Type</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Details</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                    <td className="border p-2">{item.userId}</td>
                    <td className="border p-2">{item.publisherId}</td>
                    <td className="border p-2">{item.reportType}</td>
                    <td className="border p-2">{item.reason}</td>
                    <td className="border p-2">{item.details===""?"-":item.details}</td>
                    <td className="border p-2">{item.status} - { <select
                          value={item.status}
                          onChange={(e) => updateStatus(item._id, 'report', e.target.value,item,item.publisherId)}
                          className="border rounded p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>}</td>
                    <td className="border p-2">{new Date(item.createdAt).toLocaleString()}</td>
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
        </>
      ) : null}
     </div>
    </div>
  );
};

export default ReportAndApplicationsTable;

/*import { useTheme } from '@emotion/react';
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

const ReportAndApplicationsTable = ({ section, apply = [] ,reports=[],filterType}) => {
  console.log("Reports ",reports)
    const { isDarkTheme } = useTheme();
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

export default ReportAndApplicationsTable;
*/