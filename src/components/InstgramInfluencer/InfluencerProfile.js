import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { FaUser, FaUsers, FaHeart, FaLocationArrow, FaLanguage, FaCheckCircle, FaTag, FaComment} from 'react-icons/fa';



import { UserContext } from '../../context/userContext.js';
import ReportModal from '../OtherComponents/ReportForm.js';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

import { useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';





const InfluencerProfile = () => {




  const { userData, localhosturl } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState(null);

  
  const createDescriptionElements = useCallback((formData, users) => {
    const elements = [
      { key: 'Username', value: users?.username },
      { key: 'Full Name', value: users?.fullName },
      {key: 'Verified',value: users?.verifiedStatus},
      { key: 'Profile Picture', value: users?.profilePicture },
      { key: 'Bio', value: users?.bio },
      { key: 'Followers Count', value: users?.followersCount },
      { key: 'Following Count', value: users?.followingCount },
      { key: 'Posts Count', value: users?.postsCount },
      { key: 'Engagement Rate', value: `${users?.engagementRate}%` },
      { key: 'Average Likes', value: users?.averageLikes },
      { key: 'Average Comments', value: users?.averageComments },
      { key: 'Category', value: users?.category },
      { key: 'Location', value: JSON.stringify(users?.location) },
      { key: 'Language', value: users?.language },
      { key: 'Verified Status', value: users?.verifiedStatus ? 'Verified' : 'Not Verified' },
      { key: 'Collaboration Rates (Post)', value: users?.collaborationRates?.post },
      { key: 'Collaboration Rates (Story)', value: users?.collaborationRates?.story },
      { key: 'Collaboration Rates (Reel)', value: users?.collaborationRates?.reel },
      { key: 'Past Collaborations', value: users?.pastCollaborations?.join(', ') },
      { key: 'Media Kit', value: users?.mediaKit },
      { key: 'Total results', value: users?.length }
    ];
  
    const formattedElements = elements
      .filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`)
      .join(', ');
  
    return formattedElements;
  }, []);



  const generateShortDescription = useCallback((formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');
  
    const shortElements = elements.slice(0, 2);
  
    return `You viewed an Instagram Influencer with ${shortElements.join(' and ')} successfully.`;
  }, [createDescriptionElements]); // Memoize based on `createDescriptionElements`

const pastactivitiesAdd = useCallback(async (users) => {
  if (!Array.isArray(users) || users.length === 0) {
    console.error("Invalid 'users' parameter: It should be a non-empty array.");
    return;
  }

  const formData = {}; // Initialize as needed
  const description = createDescriptionElements(formData, users);
  const shortDescription = generateShortDescription(formData, users);

  if (!userData || !userData._id || !userData.role) {
    console.error("Invalid 'userData': Ensure the user data is properly set.");
    return;
  }

  try {
    const activityData = {
      userId: userData._id,
      action: "Viewed an Instagram Influencer",
      section: "Instagram Influencer",
      role: userData.role,
      timestamp: new Date().toISOString(),
      details: {
        type: "view",
        filter: { formData, total: users.length },
        description,
        shortDescription,
      },
    };

    const response = await axios.post(
      `${localhosturl}/pastactivities/createPastActivities`,
      activityData
    );

    console.log("Activity logged successfully:", response.data);
  } catch (error) {
    console.error("Error logging past activity:", error.message || error);
  }
}, [userData, localhosturl ,createDescriptionElements , generateShortDescription]); // Dependencies are userData and localhosturl

  

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {

        const response = await axios.get(`${localhosturl}/instagraminfluencers/getInstagraminfluencerById/${id}`);
        setInfluencer(response.data);
        pastactivitiesAdd(response.data.instagramInfluencer);
      } catch (error) {
        console.error('Error fetching influencer data:', error);
      }
    };

    fetchInfluencer();
  }, [id,localhosturl,pastactivitiesAdd ]);





  



  if (!influencer) return <div className="text-center text-xl font-semibold">Loading...</div>;

  const { instagramInfluencer } = influencer;
  const {
    profilePicture,
    username,
    fullName,
    verifiedStatus,
    bio,
    followersCount,
    followingCount,
    postsCount,
    engagementRate,
    location,
    language,
    collaborationRates,
    averageLikes,
    averageComments,
    category,

    pastCollaborations,
    mediaKit
  } = instagramInfluencer;



  return (
    <div
    >

      <button
        className="mb-4 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-all"

        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
        Back
      </button>

      <div


      >
        <div
        ></div>
      </div>

      <div
      >
        <div
        >
          <div className=""//"flex flex-col lg:flex-row gap-8  p-6 rounded-lg"//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
          >

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="flex-1 flex flex-col items-center lg:items-start">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={
                      profilePicture?.startsWith('https')
                        ? profilePicture
                        // : `https://guest-posting-marketplace-web-backend.onrender.com${profilePicture}`
                        : `${localhosturl}${profilePicture}`
                    }
                    alt={username}
                    className="w-48 h-48 lg:w-64 lg:h-64 object-cover rounded-full border-4 border-white shadow-lg transition-transform transform hover:scale-105"
                  />
                </motion.div>
                <h4 className="mt-4 text-3xl lg:text-4xl font-bold text-900 p-2">{fullName || username}</h4>
                <td className="border px-4 py-2">
  <span
    className={`px-2 py-1 text-white rounded-md text-sm font-semibold`}
    style={{
      backgroundColor: verifiedStatus ? 'green' : 'red',
      display: 'inline-block',
      width: 'fit-content',
    }}
  >
    {verifiedStatus ? 'Verified' : 'Unverified'}
  </span>
</td>
              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="flex-1 ">
                <div className="grid grid-cols-1 gap-4 text-700">
                  <div className="flex items-center bg-100 p-4 rounded-lg shadow-md">
                    <FaUsers className="mr-2 text-indigo-600 text-xl" />
                    <span><strong>Followers:</strong> {followersCount}</span>
                  </div>
                  <div className="flex items-center bg-100 p-4 rounded-lg shadow-md">
                    <FaUser className="mr-2 text-indigo-600 text-xl" />
                    <span><strong>Following:</strong> {followingCount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="mt-8 bg-100 p-6 rounded-lg shadow-lg "//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
            >
              <h2 className="text-2xl font-semibold mb-4 p-2">Bio</h2>
              <p className="text-800">{bio}</p>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >

            <div className="mt-8  p-6 rounded-lg shadow-lg"//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
            >
              <h2 className="text-2xl font-semibold mb-4 p-2">Collaboration Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-700">
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                
                  <span><strong>Post:</strong><span className="text-indigo-600 font-bold">₹{collaborationRates.post}</span></span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                
                  <span><strong>Story:</strong> <span className="text-indigo-600 font-bold">₹{collaborationRates.story}</span></span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                
                  <span><strong>Reel:</strong><span className="text-indigo-600 font-bold"> ₹{collaborationRates.reel}</span></span>

                </div>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >

            <div className="mt-8 bg-100  shadow-lg  p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 p-2">Additional Metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-700">
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaHeart className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Posts:</strong> {postsCount}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaCheckCircle className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Engagement Rate:</strong> {engagementRate}%</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaLocationArrow className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Location:</strong> {`${location.country === "" ? "" : ","} ${location.state === "" ? "" : ","} ${location.city}`}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaLanguage className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Language:</strong> {language}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaTag className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Category:</strong> {category}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaComment className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Average Likes:</strong> {averageLikes}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaComment className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Average Comments:</strong> {averageComments}</span>
                </div>
              </div>
            </div>
          </motion.div>





          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="mt-8 bg-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 p-2">Media Kit & Past Collaborations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediaKit && (
                  <div className="bg-200 p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-2 p-2">Media Kit</h3>


                    <img
                      id="image-to-download"
                      src={
                        mediaKit.startsWith('https')
                          ? mediaKit
                          : `${localhosturl}${mediaKit}`
                      }
                      alt="Media Kit Preview"
                      className="mb-4 w-48 h-auto rounded"
                    />


                  </div>
                )}
                {pastCollaborations && (
                  <div className="bg-200 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2 p-2">Past Collaborations</h3>
                    <p>{pastCollaborations}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>




          { /*<Fade bottom>
            <div className="mt-8 bg-100 p-6 rounded-lg shadow-lg  p-6 rounded-lg"//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
            >
              <h2 className="text-2xl font-semibold mb-4 p-2">Media Kit & Past Collaborations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediaKit && (
                  <a
                    href={mediaKit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-200 p-4 rounded-lg shadow-md text-blue-600 hover:text-blue-800"
                  >
                    <FaFilePdf className="mr-2 text-2xl" />
                    <span>Download Media Kit</span>
                  </a>
                )}
                {pastCollaborations && (
                  <div className="bg-200 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2 p-2">Past Collaborations</h3>
                    <p>{pastCollaborations}</p>
                  </div>
                )}
              </div>
            </div>
          </Fade>*/}

          {/* Application Form
          <Fade bottom>
            <div className="mt-8  p-6 rounded-lg shadow-lg  p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 p-2">Apply for Collaboration</h2>
              {formSubmitted ? (
                <div className="text-green-600 text-lg font-semibold">Application submitted successfully!</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" style={{backgroundColor:"transparent",boxShadow:"none"}}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{backgroundColor:"transparent"}}>
                    <div>
                      <label className="block text-700">Brand Name</label>
                      <input
                        type="text"
                        name="brandName"
                        value={form.brandName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Contact Person</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div> 
                      <label className="block text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                 
                  
                  <div>
                    
                    <label className="block text-gray-700">Collaboration Type</label>
                    <select
                 
                  name="collaborationType"
                  value={form.collaborationType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                </select>
                    
                  </div>
                  <div>
                    <label className="block text--700">Budget</label>
                    <input
                      type="text"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-700">Campaign Details</label>
                    <textarea
                      name="campaignDetails"
                      value={form.campaignDetails}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-700">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="4"
                    />
                  </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </Fade>
 */}



        </div>
      </div>
      <div>
        <ReportModal
          section="InstagramInfluencer"
          // isOpen={isModalOpen}
          // onClose={() => setIsModalOpen(false)}
          userId={userData._id}
          publisherId={id}
          localhosturl={localhosturl}
        />

      </div>
    </div>
  );
};

export default InfluencerProfile;
