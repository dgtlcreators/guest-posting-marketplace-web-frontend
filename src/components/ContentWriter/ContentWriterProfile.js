import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLanguage, FaBook, FaDollarSign, FaEnvelope } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import ReportModal from '../OtherComponents/ReportForm';




const ContentWriterProfile = () => {
  const { isDarkTheme } = useTheme();
  const { id } = useParams();
  const [contentWriter,setContentWriter]=useState("")
  const { userData,localhosturl } = useContext(UserContext);
  const [toastShown, setToastShown] = useState(false);
  
  
  useEffect(() => {
    let isMounted = true; 
  
    const fetchContentWriter = async () => {
      try {
        const response = await axios.get(`${localhosturl}/contentwriters/getcontentwriter/${id}`);
        if (isMounted) {
          setContentWriter(response.data.data);
          if (!toastShown) {
            toast.success("Fetching Content Writer Profile Successfully");
            setToastShown(true);
          }
        }
      } catch (error) {
        console.error('Error fetching Content Writer data:', error);
      }
    };
  
    fetchContentWriter();
  
    // Cleanup function to handle component unmount
    return () => {
      isMounted = false;
    };
  }, [id, localhosturl, toastShown]);

  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedReportType, setSelectedReportType] = useState('');
const [reason, setReason] = useState('');
const [details, setDetails] = useState('');

const handleReport = async () => {
  console.log("Report Data:", {
      userId: userData._id,
      publisherId: contentWriter._id,
      section: "Profile",
      reportType: selectedReportType,
      reason: reason,
      details: details,
  });

  const reportData = {
      userId: userData._id,
      publisherId: contentWriter._id,
      section: "Profile",
      reportType: selectedReportType,
      reason: reason,
      details: details,
  };

  try {
      const response = await axios.post(`${localhosturl}/reportroute/createreport`, reportData);
      if (response.data.success) {
          toast.success("Report submitted successfully!");
          setSelectedReportType('');
          setReason('');
          setDetails('');
          setIsModalOpen(false); 
      }
  } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Error submitting report. Please try again later.");
  }
};




  return (
    <div className="min-h-screen  flex items-center justify-center p-8">
      <div className=" rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-400"
              />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-800 p-2">{contentWriter.name}</h2>
              <p className="text-lg  mt-2">{contentWriter.bio}</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              <FaBook className="text-600 mr-2" /> Experience
            </h3>
            <p className="text-lg text-600 mt-2">{contentWriter.experience} years</p>
          </div>

          {/* Expertise Section */}
          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              <FaUser className="text-600 mr-2" /> Expertise
            </h3>
            <ul className="list-disc list-inside text-lg text-600 mt-2">
              {contentWriter?.expertise?.map((item, index) => (
                <li key={index}>{item.type} {item.other && `(${item.other})`}</li>
              ))}
            </ul>
          </div>

          {/* Languages Section */}
          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              <FaLanguage className="text-600 mr-2" /> Languages
            </h3>
            <ul className="list-disc list-inside text-lg text-600 mt-2">
              {contentWriter?.languages?.map((lang, index) => (
                <li key={index}>{lang.name} ({lang.proficiency})</li>
              ))}
            </ul>
          </div>

          {/* Collaboration Rates Section */}
          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              <FaDollarSign className="text-600 mr-2" /> Collaboration Rates
            </h3>
            <p className="text-lg text-600 mt-2">Post: ${contentWriter?.collaborationRates?.post}</p>
            <p className="text-lg text-600">Story: ${contentWriter?.collaborationRates?.story}</p>
            <p className="text-lg text-600">Reel: ${contentWriter?.collaborationRates?.reel}</p>
          </div>

          {/* Contact Section */}
          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              <FaEnvelope className="text-600 mr-2" /> Contact
            </h3>
            <p className="text-lg text-600 mt-2">{contentWriter.email}</p>
          </div>
          <ReportModal
          section="ContenWriters" 
           // isOpen={isModalOpen}
           // onClose={() => setIsModalOpen(false)}
            userId={userData._id}
            publisherId={id}
            localhosturl={localhosturl} 
          />

         {/* <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            Report
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-80">
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
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReport} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}*/}

        </motion.div>
      </div>
    </div>
  );
};

export default ContentWriterProfile;
