import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaUsers, FaHeart, FaLocationArrow, FaLanguage, FaCheckCircle, FaDollarSign, FaTag, FaComment, FaFilePdf } from 'react-icons/fa';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import ReportModal from '../OtherComponents/ReportForm';


const InfluencerProfile = () => {
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext);
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [form, setForm] = useState({
    userId:userData?._id,
    brandName: '',
    contactPerson: '',
    email: '',
    phone: '',
    campaignDetails: '',
    collaborationType: '',
    budget: '',
    notes: ''
    
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


  const createDescriptionElements = (formData, users) => {
    
    const elements = [
      { key: 'Username', value: users?.username },
      { key: 'Full Name', value: users?.fullName },
      { key: 'Profile Picture', value: users?.profilePicture },
      { key: 'Bio', value: users?.bio },
      { key: 'Followers Count', value: users?.followersCount },
      { key: 'Following Count', value: users?.followingCount },
      { key: 'Posts Count', value: users?.postsCount },
      { key: 'Engagement Rate', value: `${users?.engagementRate}%` },
      { key: 'Average Likes', value: users?.averageLikes },
      { key: 'Average Comments', value: users?.averageComments },
      { key: 'Category', value: users?.category },
      { key: 'Location', value: users?.location },
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
  return `${formattedElements}`;
};
const generateShortDescription = (formData, users) => {
 
  const elements = createDescriptionElements(formData, users).split(', ');
  
 
  const shortElements = elements.slice(0, 2);

  return `You viewed a Instagram Influencer with ${shortElements.join(' and ')} successfully.`;
};

  const pastactivitiesAdd=async(users)=>{
    const formData={}
    
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);
  
   try {
    const activityData={
      userId:userData?._id,
      action:"Viewed a Instagram Influencer",
      section:"Instagram Influencer",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"view",
        filter:{formData,total:users.length},
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
    const applicationData = {
      ...form,
      influencerId: id // Include influencerId in the application data
    };

    try {
    
      await axios.post(`${localhosturl}/userbrand/addapplications`, applicationData);
      setFormSubmitted(true);
      setForm({
        brandName: '',
        contactPerson: '',
        email: '',
        phone: '',
        campaignDetails: '',
        collaborationType: '',
        budget: '',
        notes: ''
      });
      
      toast.success("Sent Application successfully")
    } catch (error) {
        toast.error(`Error submitting application:', ${error}`)
      console.error('Error submitting application:', error);
    }
  };

  if (!influencer) return <div className="text-center text-xl font-semibold">Loading...</div>;

  const { instagramInfluencer } = influencer;
  const {
    profilePicture,
    username,
    fullName,
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
    verifiedStatus,
    pastCollaborations,
    mediaKit
  } = instagramInfluencer;




  const handleReport = async () => {
    const reportData = {
      reporterId: userData?._id,
      influencerId: id,
      reason: "Fake Profile", 
    };

    try {
     // await axios.post(`${localhosturl}/report`, reportData);
    //  setReportSubmitted(true);
      toast.success("Profile reported successfully!");
    } catch (error) {
      toast.error("Error reporting profile");
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen  bg-contain"//bg-gradient-to- from-blue-200 via-purple-300 to-pink-500 bg-cover
    >
      <div className="absolute top-0 left-0 right-0 h-48 bg-no-repeat bg-top bg-contain" style={{ backgroundImage: 'url("https://example.com/top-flowers.png")' }}></div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url("https://source.unsplash.com/random/1600x900")' }}
      >
        <div className="absolute inset-0  opacity-0 bg-cover"//bg-gradient-to- from-black to-transparent
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 bg-cover">
        <div className=" bg-opacity-90 rounded-lg shadow-lg overflow-auto p-6 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8  p-6 rounded-lg"//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
          >
            {/* Profile Image & Name */}
            <Fade left>
              <div className="flex-1 flex flex-col items-center lg:items-start">
                <Zoom>
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
                </Zoom>
                <h4 className="mt-4 text-3xl lg:text-4xl font-bold text-900 p-2">{fullName || username}</h4>
              </div>
            </Fade>

            {/* Followers & Following */}
            <Fade right>
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
            </Fade>
          </div>

          {/* Bio */}
          <Fade bottom>
            <div className="mt-8 bg-100 p-6 rounded-lg shadow-lg  p-6 rounded-lg"//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
            >
              <h2 className="text-2xl font-semibold mb-4 p-2">Bio</h2>
              <p className="text-800">{bio}</p>
            </div>
          </Fade>

          {/* Collaboration Details */}
          <Fade bottom>
            <div className="mt-8  p-6 rounded-lg shadow-lg"//bg-gradient-to-r from-yellow-300 via-pink-300 to-red-300
            >
              <h2 className="text-2xl font-semibold mb-4 p-2">Collaboration Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-700">
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaDollarSign className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Post:</strong> ${collaborationRates.post}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaDollarSign className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Story:</strong> ${collaborationRates.story}</span>
                </div>
                <div className="flex items-center bg-200 p-4 rounded-lg shadow-md">
                  <FaDollarSign className="mr-2 text-indigo-600 text-xl" />
                  <span><strong>Reel:</strong> ${collaborationRates.reel}</span>
                </div>
              </div>
            </div>
          </Fade>

          {/* Additional Metrics */}
          <Fade top>
            <div className="mt-8 bg-100 p-6 rounded-lg shadow-lg  p-6 rounded-lg">
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
                  <span><strong>Location:</strong> {location}</span>
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
          </Fade>

          {/* Media Kit & Past Collaborations */}
          <Fade bottom>
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
          </Fade>

          {/* Application Form */}
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


            {/* Report Profile Section */}
      <Fade bottom>
      <ReportModal
           // isOpen={isModalOpen}
           // onClose={() => setIsModalOpen(false)}
            userId={userData._id}
            publisherId={id}
            localhosturl={localhosturl} 
          />
        {/*<div className="mt-8 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Report Profile</h2>
          {reportSubmitted ? (
            <div className="text-green-600 text-lg font-semibold">Profile reported successfully!</div>
          ) : (
            <button
              onClick={handleReport}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Report This Profile
            </button>
          )}
        </div>*/}
      </Fade>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
