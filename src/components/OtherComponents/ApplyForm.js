import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext.js';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider.js';
import { toast } from 'react-toastify';

const ApplyForm = ({ section, publisher }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const { isDarkTheme } = useTheme();
  const userId = userData?._id;
  const publisherId = publisher?._id;


  const disableCheck = (section === "Guestpost" && !userData.permissions.guestPost.apply) ||
  (section === "InstagramInfluencer" && !userData.permissions.instagram.apply) ||
  (section === "YoutubeInfluencer" && !userData.permissions.youtube.apply) ||
  (section === "ContenWriters" && !userData.permissions.contentWriter.apply) 
 //console.log("disableCheck ",disableCheck)

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

    return `You created a new Apply with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    // console.log("users: ",users)
    const formData = {}
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Created a new application entry",//New application submitted
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/; 
  if (!phoneRegex.test(formData.phone)) {
    toast.error('Mobile number must be exactly 10 digits.');
    return;
  }

    try {
      console.log("This is testing ",publisherId)
      /**
       * const message = userData.role === 'User Brand' 
    ? `You applied to ${publisherId} with the name ${formData.name}.`
    : `New application submitted by ${formData.name}.`;

       *  const text2 = userRole === 'Brand Representative'
    ? `Brand Representative ${formData.name} has submitted an application.`
    : `Application submitted by ${formData.name}.`;
       *  details: {
            message: userRole === 'User Brand'
              ? `User Brand ${formData.name} submitted an application.`
              : `New application submitted by ${formData.name}.`,
          }, */

         
       // const text2=`New application submitted by ${formData.name}`
//const text2=`Brand User ${formData.name} has submitted an application for section: ${section}.`
  //const text1=`You reported for section: ${section}.`
  //const text1 = `${userData.username} applied using the name ${formData.name} for section: ${section}.`;

  const text1 = `You, ${userData.name} applied using the name ${formData.name},  for section: ${section}`;
const text2 = `New application submitted by ${userData.name}, with the name ${formData.name}, for section: ${section}.`;


     const response = await axios.post(`${localhosturl}/applyroute/apply`, {
        userId,
        publisherId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        section,
      });

      if (response.status === 201) {
        console.log('Posting notification with body1:', {
          userId,
          publisherId,
          section,
          status: 'pending',  
          isBookmarked: false,
          formData: [{       
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
          }],
          details: {
              message: `New application submitted by ${formData.name}.`,
              text1,
              text2
          },
          userStatus: [
              {
                  userId, 
                  isSeen: false,
                  isBookmarked: false,
              }
          ],
      });
      
      const response2=  await axios.post(`${localhosturl}/notificationroute/createNotifications`, {
          userId,
          publisherId,
          section,
          status: 'pending',  
          isBookmarked: false,
          formData: [       
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          ],
          details: {
            message: `New application submitted by ${formData.name}.`,
            text1,text2
          },
          userStatus: [
            {
                userId, 
                isSeen: false,
                isBookmarked: false,
            }
        ],
        });
        console.log("Apply response ",response2.data)
        
      
  
        // const { remainingApplications } = response.data; 
        const users = response.data.data
       //  console.log("users Inside ",users)
        //console.log("formData ",formData)
        pastactivitiesAdd(users)
        //toast.success(`Application applied successfully! You have ${remainingApplications} applications remaining today.`);
        toast.success('Application applied successfully!');
        setIsFormVisible(false);

      }
      setFormData({
        name: '',
        email: '',
        phone: '',
      })

    } catch (error) {
      console.error('Failed to submit application:', error);
      console.log(error,error.response)
      //toast.error('Failed to submit application. You may have reached the application limit for today.');
      toast.error(`${error.response.data.error}`)
    }
  };

  return (
    <div className=""//"min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-900 to-black"
    >
      {!isFormVisible ? (
        <button
          disabled={disableCheck}
          title={disableCheck
            ? "You are not allowed to access this feature"
            :undefined// : ""
          }
          onClick={() => setIsFormVisible(true)}
          className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
        //"px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Apply
        </button>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/**<form 
          onSubmit={handleSubmit}
          className={`fixed inset-0 flex items-center justify-center  bg-opacity-50 ${isDarkTheme?" backdrop-blur-md" : "backdrop-blur-md"}`}
          //"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"//" bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full"
        >
           <div className=" p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 ">Application Form</h2>
          <div className="mb-4">
            <label className=" ">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 bg-opacity-30 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className=" ">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 bg-opacity-30 text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className=" ">Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 bg-opacity-30 text-white"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Submit Application
          </button>
          <button 
            onClick={() => setIsFormVisible(false)}
            className="mt-4 w-full bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Cancel
          </button>
          </div>
        </form> */}
          <div className=" ">

            <form onSubmit={handleSubmit} className='p-8 rounded shadow-lg'>
              <span className="text-xl font-bold mb-4 text-center">Application Form</span>
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 bg-opacity-30 "
                  required
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 bg-opacity-30 "
                  required
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-2">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full  p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 bg-opacity-30 "
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplyForm;
