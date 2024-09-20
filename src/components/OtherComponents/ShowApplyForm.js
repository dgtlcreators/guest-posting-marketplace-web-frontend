import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { useTheme } from '@emotion/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Background from 'three/src/renderers/common/Background.js';

const ShowApplyForm = ({ section, publisher }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const { isDarkTheme } = useTheme();
  const userId = userData?._id;
  const publisherId = publisher?._id;
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedUserApplys, setSelectedUserApplys] = useState([]);
  const [showApplyDetails, setShowApplyDetails] = useState(false)
  const [users, setUsers] = useState([]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const formBgColor="#f5f5dc"//isDarkTheme?"#424242":"#f9f9f9"

  const disableCheck = (section === "Guestpost" && !userData.permissions.guestPost.apply) ||
    (section === "InstagramInfluencer" && !userData.permissions.instagram.apply) ||
    (section === "YoutubeInfluencer" && !userData.permissions.youtube.apply) ||
    (section === "ContenWriters" && !userData.permissions.contentWriter.apply)


  const createDescriptionElements = (formData, users) => {
    // console.log("createDescriptionElements formData and users",formData,users)
    const elements = [
      //{ key: 'User ID', value: users.userId },
      { key: 'Publisher', value: users.publisher },
      { key: 'Name', value: users.name },
      { key: 'Email', value: users.email },
      { key: 'Phone', value: users.phone },
      { key: 'Section', value: users.section },
      { key: 'Status', value: users.status },
      //{ key: 'Created At', value: users.createdAt.toISOString() } // Formats date to ISO string
    ];


    const formattedElements = elements
      .filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`)
      .join(', ');
    return `${formattedElements}`;
  };
  const generateShortDescription = (formData, users) => {
    // console.log("generateShortDescription formData and users",formData,users)
    const elements = createDescriptionElements(formData, users).split(', ');


    const shortElements = elements.slice(0, 2);

    return `You delete a Apply with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    // console.log("users: ",users)
    const formData = {}
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Delete a new application entry",//New application submitted
        section: "Apply",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "apply",
          filter: { formData: users, total: users.length },
          description,
          shortDescription


        }
      }

      axios.post(`${localhosturl}/pastactivities/createPastActivities`, activityData)
    } catch (error) {
      console.log(error);

    }
  }


  const handleShowApplyDetails = async (userId) => {
    setShowApplyDetails(true)
    try {
      const response = await axios.get(`${localhosturl}/applyroute/getApplyByPublisherId/${userId}`);
      const res = response.data.data

      // console.log(res)
      setSelectedUserApplys(res);
      setShowApplyDetails(true)
    } catch (error) {
      if (error.response) {

        console.log(error.response.data, error.response.status, error.response.headers);
        if (error.response.status === 404) {
          // setSelectedUserApplys(error.response.data.msg);
        }
        toast.error(`Error fetching apply details: ${error.response.data.msg}`);
      } else if (error.request) {

        console.log(error.request);
        toast.error("No response received from server");
      } else {

        console.log("Error", error.message);
        toast.error(`Error fetching apply details: ${error.message}`);
      }
      console.error("Error fetching apply details:", error);
    }
  };

  return (
    <div className=""//"min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-900 to-black"
    >
      
        <button disabled={disableCheck}
          title={disableCheck
            ? "You are not allowed to access this feature"
            : undefined// : ""
          }
          onClick={() => handleShowApplyDetails(publisher?._id)}
          // onClick={() => setIsFormVisible(true)}
          className="border bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
        //"px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          View Apply
        </button>
    
        {showApplyDetails && Array.isArray(selectedUserApplys) && (
  <div 
  className={`fixed inset-0 flex items-center justify-center  bg-opacity-75 transition-all duration-300 z-50`}
 
 // className={`fixed inset-0 flex items-center justify-center  ${isDarkTheme ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-50"}  bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 transition-all duration-300`}
  //className={`fixed inset-0 flex items-center justify-center  bg-opacity-50 ${isDarkTheme?"":""}`}
  >
    <div className=" p-8 rounded shadow-lg showapply"
    //style={{ backgroundColor: formBgColor }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Apply Details:</h3>
        <button
          onClick={() => setShowApplyDetails(false)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <table className="min-w-full ">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Apply Name</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Apply Email</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Apply Message</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Apply Time</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {selectedUserApplys.length<=0 ?
          <tr>
          <td
            colSpan="10"
            className="py-3 px-6 text-center text-lg font-semibold"
          >
            No Data Found
          </td>
        </tr>
          :
          selectedUserApplys.map((apply, index) => (
            <tr key={index} className="bg-gray-100 border-b border-gray-200">
              <td className="py-3 px-4">{apply.name}</td>
              <td className="py-3 px-4">{apply.email}</td>
              <td className="py-3 px-4">{apply.message}</td>
              <td className="py-3 px-4">{apply.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{showApplyDetails && !Array.isArray(selectedUserApplys) && (
  <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
    <div className=" p-8 rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Apply Details:</h3>
        <button
          onClick={() => setShowApplyDetails(false)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-4 text-red-500 font-bold">{selectedUserApplys}</div>
    </div>
  </div>
)}

      
    </div>
  )
}
export default ShowApplyForm