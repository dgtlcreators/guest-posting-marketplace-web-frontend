import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLanguage, FaBook, FaDollarSign, FaEnvelope } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';



const ContentWriterProfile = () => {
  const { id } = useParams();
  const [contentWriter,setContentWriter]=useState("")

  
  useEffect(() => {
    const fetchContentWriter = async () => {
      try {
        const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/getcontentwriter/${id}`);
        //const response = await axios.get(`http://localhost:5000/contentwriters/getcontentwriter/${id}`);
      
       // console.log(response.data.data,id)
       toast.success("Fetching Content Writer Profile Successfully")
        setContentWriter(response.data.data);
      } catch (error) {
        console.error('Error fetching Content Writer data:', error);
      }
    };

    fetchContentWriter();
  }, [id]);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
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
              <h2 className="text-3xl font-bold text-gray-800">{contentWriter.name}</h2>
              <p className="text-lg text-gray-700 mt-2">{contentWriter.bio}</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaBook className="text-gray-600 mr-2" /> Experience
            </h3>
            <p className="text-lg text-gray-600 mt-2">{contentWriter.experience} years</p>
          </div>

          {/* Expertise Section */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaUser className="text-gray-600 mr-2" /> Expertise
            </h3>
            <ul className="list-disc list-inside text-lg text-gray-600 mt-2">
              {contentWriter?.expertise?.map((item, index) => (
                <li key={index}>{item.type} {item.other && `(${item.other})`}</li>
              ))}
            </ul>
          </div>

          {/* Languages Section */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaLanguage className="text-gray-600 mr-2" /> Languages
            </h3>
            <ul className="list-disc list-inside text-lg text-gray-600 mt-2">
              {contentWriter?.languages?.map((lang, index) => (
                <li key={index}>{lang.name} ({lang.proficiency})</li>
              ))}
            </ul>
          </div>

          {/* Collaboration Rates Section */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaDollarSign className="text-gray-600 mr-2" /> Collaboration Rates
            </h3>
            <p className="text-lg text-gray-600 mt-2">Post: ${contentWriter?.collaborationRates?.post}</p>
            <p className="text-lg text-gray-600">Story: ${contentWriter?.collaborationRates?.story}</p>
            <p className="text-lg text-gray-600">Reel: ${contentWriter?.collaborationRates?.reel}</p>
          </div>

          {/* Contact Section */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaEnvelope className="text-gray-600 mr-2" /> Contact
            </h3>
            <p className="text-lg text-gray-600 mt-2">{contentWriter.email}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentWriterProfile;
