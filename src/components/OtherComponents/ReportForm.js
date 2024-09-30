import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReportModal = ({ section,userId, publisherId, localhosturl }) => {
  console.log(publisherId)
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false); 

  const handleSubmit = async () => {
    const reportData1 = {
      userId,
      publisherId,
      reportType: selectedReportType,
      reason,
      details,
    };
    const reportData = {
      userId: userId,
      publisherId: publisherId,
      section,
      //section: "Profile",
      reportType: selectedReportType,
      reason: reason,
      details: details,
  };
  
    console.log("Submitting report data:", reportData); 
    if (!userId || !publisherId || !reportData.section || !reportData.reportType || !reason) {
      toast.error('Please provide all required fields.');
      return; 
    }

  
    try {
      const response = await axios.post(`${localhosturl}/reportroute/createreport`, reportData);
      if (response.data.success) {
        toast.success("Report submitted successfully!");
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting report:', error.response.data); 
      toast.error("Error submitting report. Please try again later.");
    }
  };
  

  const resetForm = () => {
    setSelectedReportType('');
    setReason('');
    setDetails('');
    setIsFormVisible(false); 
  };

  return (
    <div>
      <button 
    onClick={() => setIsFormVisible(true)}
    className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
  >
    Report
  </button>
  {isFormVisible &&  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-80">
        
          <>
            <h3 className="text-lg font-semibold mb-4">Submit a Report</h3>

            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
            >
              <option value="">Select Report Type</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
              required
            />

            <textarea
              placeholder="Additional details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
            ></textarea>

            <div className="flex justify-between">
              <button onClick={resetForm} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </>
         
      </div>
    </div>}
 
    </div>
   
  );
};

export default ReportModal;






/*import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider';
import { toast } from 'react-toastify';

const ReportForm = ({ section, publisher }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const { isDarkTheme } = useTheme();
  const userId = userData?._id;
  const publisherId = publisher;

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    details: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${localhosturl}/reportroute/createreport`, {
        userId,
        publisherId,
        section,
        reason: formData.reason,
        details: formData.details,
      });

      if (response.status === 201) {
        toast.success('Report submitted successfully!');
        setIsFormVisible(false);
      }
      setFormData({
        reason: '',
        details: '',
      });
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <div>
      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md"
        >
          Report
        </button>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Report Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-2">Reason:</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">Details:</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
*/