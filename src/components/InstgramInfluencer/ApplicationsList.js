import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';


const ApplicationsList = () => {
  const { isDarkTheme } = useTheme();
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      //const response = await axios.get('http://localhost:5000/userbrand/getallapplications');
      const response = await axios.get('https://guest-posting-marketplace-web-backend.onrender.com/userbrand/getallapplications');
      setApplications(response.data.data);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://guest-posting-marketplace-web-backend.onrender.com/userbrand/deleteapplications/${id}`);
     // const response = await axios.delete(`http://localhost:5000/userbrand/deleteapplications/${id}`);
      alert(response.data.message);
      fetchApplications();
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-3xl font-semibold mb-6">All Applications</h2>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 border border-gray-300 bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application._id} className="transition-transform  hover:scale-105 duration-300 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.brandName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.emailId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.campaignDetails}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/editapplication${application._id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    onClick={() => alert('Edit functionality not implemented yet')}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit
                  </Link>
                  <button
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out ml-2"
                    onClick={() => handleDelete(application._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsList;
