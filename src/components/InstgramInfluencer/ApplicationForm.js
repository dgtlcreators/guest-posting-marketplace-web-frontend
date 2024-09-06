import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faEnvelope, faPhone, faDollarSign, faClipboard, faStickyNote, faHandshake, faUser } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';
import ApplicationsList from "./ApplicationsList"
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';


const ApplicationForm = () => {
  const { isDarkTheme} = useTheme();
  const [formData, setFormData] = useState({
    brandName: '',
    emailId: '',
    phoneNumber: '',
    campaignDetails: '',
    preferredCollaborationType: '',
    budget: '',
    additionalNotes: '',
  });
  const { userData ,localhosturl} = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const response = await axios.post(`${localhosturl}/userbrand/addapplications`, formData);
      alert(response.data.message);
      setFormData({
        brandName: '',
        emailId: '',
        phoneNumber: '',
        campaignDetails: '',
        preferredCollaborationType: '',
        budget: '',
        additionalNotes: '',
      });
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Submit Application</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">brandName</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandNamee}
                  onChange={handleChange}
                  className="h-7 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="flex-1 mt-4 lg:mt-0">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="h-7 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="h-7 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="flex-1 mt-4 lg:mt-0">
              <label className="block text-sm font-medium text-gray-700">Campaign Details</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faClipboard} className="text-gray-400" />
                </div>
                <textarea
                  name="campaignDetails"
                  value={formData.campaignDetails}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Preferred Collaboration Type</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faHandshake} className="text-gray-400" />
                </div>
                <select
                  name="preferredCollaborationType"
                  value={formData.preferredCollaborationType}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                </select>
              </div>
            </div>
            <div className="flex-1 mt-4 lg:mt-0">
              <label className="block text-sm font-medium text-gray-700">Budget</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="h-7 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faStickyNote} className="text-gray-400" />
              </div>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faPaperPlane} className="text-indigo-300 group-hover:text-indigo-400" />
            </span>
            Submit
          </button>
        </form>
        <ApplicationsList/>
      </div>
     
    </div>
  );
};

export default ApplicationForm;
