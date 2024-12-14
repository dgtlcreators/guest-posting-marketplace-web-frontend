import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLanguage, FaBook, FaDollarSign, FaEnvelope } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/userContext.js';
import ReportModal from '../OtherComponents/ReportForm.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';




const ContentWriterProfile = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const [contentWriter, setContentWriter] = useState("")
  const { userData, localhosturl } = useContext(UserContext);
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
    <div className=""
    >
      <button
        className="mb-4 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-all"

        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
        Back
      </button>
      <div className=" rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div className="flex items-center space-x-6 mb-8">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-400"
              />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-800 p-2">{contentWriter.name}</h2>
              <div>  
  <span
    className={`px-2 py-1 text-white rounded-md text-sm font-semibold`}
    style={{
      backgroundColor: contentWriter.verifiedStatus ? 'green' : 'red',
      display: 'inline-block',
      width: 'fit-content',
    }}
  >
    {contentWriter.verifiedStatus ? 'Verified' : 'Unverified'}
  </span>
  </div> 
              <p className="text-lg  mt-2">{contentWriter.bio}</p>
            </div>
          </div>


          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              <FaBook className="text-600 mr-2" /> Experience
            </h3>
            <p className="text-lg text-600 mt-2">{contentWriter.experience} years</p>
          </div>


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

          <div className="mb-6 p-4  rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-800 flex items-center p-2">
              Collaboration Rates
            </h3>
            <p className="text-lg text-600 mt-2">Hourly Rate: ₹ {contentWriter?.collaboration?.hourlyRate}</p>
            <p className="text-lg text-600">Per Word Rate: ₹ {contentWriter?.collaboration?.perWordRate}</p>
            <p className="text-lg text-600">Project Rate: ₹ {contentWriter?.collaboration?.projectRate}</p>
          </div>



        </motion.div>
      </div>
      <ReportModal
        section="ContenWriters"

        userId={userData._id}
        publisherId={id}
        localhosturl={localhosturl}
      />
    </div>
  );
};

export default ContentWriterProfile;
