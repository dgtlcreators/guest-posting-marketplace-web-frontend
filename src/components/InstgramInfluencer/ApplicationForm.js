import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';

import { UserContext } from '../../context/userContext.js';

const ApplicationForm = ({ SetShowApplication }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    emailId: '',
    phoneNumber: '',
    campaignDetails: '',
    preferredCollaborationType: '',
    budget: '',
    additionalNotes: '',
  });

  const { localhosturl } = useContext(UserContext);

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
      SetShowApplication(false);  // Close the form after successful submission
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl relative">
        {/* Close Button */}
        <button
          onClick={() => SetShowApplication(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Submit Application</h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Campaign Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Details</label>
            <textarea
              name="campaignDetails"
              value={formData.campaignDetails}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Collaboration Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Collaboration Type</label>
            <select
              name="preferredCollaborationType"
              value={formData.preferredCollaborationType}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="reel">Reel</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md"
              rows="4"
            ></textarea>
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Submit <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
