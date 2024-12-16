import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/userContext.js';
import ApplicationForm from '../InstgramInfluencer/ApplicationForm.js';

// import { IoMdStats } from 'react-icons/io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faMapMarkerAlt, faLanguage, faTags, faUsers, faVideo, faChartLine, faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
//import Lottie from 'react-lottie';
import ReportModal from '../OtherComponents/ReportForm.js';
//import animationData from '../animations/profileAnimation.json';
//const animationData="https://cdnl.iconscout.com/lottie/premium/preview-watermark/user-profile-girl-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--pretty-logo-beautiful-avatar-pack-people-icons-6633090.mp4"

const YoutubeInfluencerProfile = () => {
  
  const { userData,localhosturl } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    profilePicture: "",
    bio: "",
    followersCount: 0,
    videosCount: 0,
    engagementRate: 0,
    averageViews: 0,
    category: "",
    location: {
      country: "",
      state: "",
      city: ""
    },
    language: "",
    collaborationRates: {
      sponsoredVideos: 0,
      productReviews: 0,
      shoutouts: 0
    },
    pastCollaborations: [],
    audienceDemographics: {
      age: [],
      gender: [],
      geographicDistribution: []
    },
    mediaKit: "",
  })


  const createDescriptionElements = useCallback(
    (formData, users) => {
      const elements = [
        { key: "Username", value: formData.username },
        { key: "Full Name", value: formData.fullName },
        { key: "Profile Picture", value: formData.profilePicture },
        { key: "Bio", value: formData.bio },
        { key: "Followers Count", value: formData.followersCount },
        { key: "Following Count", value: formData.followingCount },
        { key: "Posts Count", value: formData.postsCount },
        { key: "Engagement Rate", value: `${formData.engagementRate}%` },
        { key: "Average Likes", value: formData.averageLikes },
        { key: "Average Comments", value: formData.averageComments },
        { key: "Category", value: formData.category },
        { key: "Location", value: JSON.stringify(formData.location) },
        { key: "Language", value: formData.language },
        {
          key: "Verified Status",
          value: formData.verifiedStatus ? "Verified" : "Not Verified",
        },
        { key: "Collaboration Rates (Post)", value: formData.collaborationRates.post },
        { key: "Collaboration Rates (Story)", value: formData.collaborationRates.story },
        { key: "Collaboration Rates (Reel)", value: formData.collaborationRates.reel },
        {
          key: "Past Collaborations",
          value: formData.pastCollaborations?.join(", "),
        },
        { key: "Media Kit", value: formData.mediaKit },
        { key: "Total results", value: users?.length },
      ];
  
      const formattedElements = elements
        .filter((element) => element.value)
        .map((element) => `${element.key}: ${element.value}`)
        .join(", ");
  
      return `${formattedElements}`;
    },
    [] // No dependencies, as it relies only on its arguments
  );

  const [showApplication, SetShowApplication] = useState(false);

  const generateShortDescription = useCallback(
    (formData, users) => {
      const elements = createDescriptionElements(formData, users).split(', ');
  
      const shortElements = elements.slice(0, 2);
  
      return `You viewed a YouTube Influencer ${shortElements.length > 0 ? "with" : ""} ${shortElements.join(' and ')} successfully.`;
    },
    [createDescriptionElements] // Dependency
  );


  const pastactivitiesAdd = useCallback(
    async (users) => {
      try {
        const description = createDescriptionElements(formData, users);
        const shortDescription = generateShortDescription(formData, users);
  
        const activityData = {
          userId: userData?._id,
          action: "Viewed a YouTube Influencer",
          section: "YouTube Influencer",
          role: userData?.role,
          timestamp: new Date(),
          details: {
            type: "view",
            filter: { formData, total: users.length },
            description,
            shortDescription,
          },
        };
  
        await axios.post(`${localhosturl}/pastactivities/createPastActivities`, activityData);
      } catch (error) {
        console.error("Error adding past activities:", error);
      }
    },
    [formData, userData, localhosturl ,generateShortDescription, createDescriptionElements] // Dependencies
  );
  
  const fetchInfluencers = useCallback(async () => {
    try {
      const response = await axios.get(`${localhosturl}/youtubeinfluencers/getYoutubeInfluencer/${id}`);
      setFormData(response.data.data);

      // Ensure `formData` is handled properly
      await pastactivitiesAdd(response.data.data);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  }, [id, localhosturl, pastactivitiesAdd]);

  useEffect(() => {
     
    fetchInfluencers();
    
  }, [fetchInfluencers]);




  



  /*const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, 
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };*/
  return (
    <div //style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '10px', perspective: '1000px' }}
    >
    <button 
     className="mb-4 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-all"
      //style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      //onClick={() => history.goBack()}
      onClick={() => navigate(-1)}
    >
      <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
      Back
    </button>

    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-evenly',
        transformStyle: 'preserve-3d', 
        transition: 'transform 0.5s', 
        padding: '20px',
        boxShadow: '0px 10px 30px rgba(0,0,0,0.1)', 
        borderRadius: '10px' 
      }}
      onMouseMove={(e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 20;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 20;
        e.currentTarget.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'rotateY(0) rotateX(0)';
      }}
    >
      <img
      src={
        formData?.profilePicture?.startsWith('https')
          ? formData.profilePicture
         // : `https://guest-posting-marketplace-web-backend.onrender.com${formData.profilePicture}`
          : `${localhosturl}${formData.profilePicture}`
      }
        //src={formData.profilePicture || 'default-profile.png'}
        alt={`${formData.fullname}'s Profile`}
        style={{ width: '150px', height: '150px', borderRadius: '50%', marginRight: '20px', transition: 'transform 0.3s' }}
      />
      <div>
        <h4 style={{ margin: '0' }}>{formData.fullname}</h4>
        <p>@{formData.username}</p>
      </div>
   <div>  
  <span
    className={`px-2 py-1 text-white rounded-md text-sm font-semibold`}
    style={{
      backgroundColor: formData.verifiedStatus ? 'green' : 'red',
      display: 'inline-block',
      width: 'fit-content',
    }}
  >
    {formData.verifiedStatus ? 'Verified' : 'Unverified'}
  </span>
  </div> 

    </div>
    <br/>
      <h3>Bio</h3>
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', animation: 'fadeInUp 1s ease-in-out' }}>
    <p style={{ marginTop: '20px', animation: 'fadeIn 1s ease-in-out' }}>{formData.bio}</p>
    </div>

    <br/>
    <h3>Information</h3>
    <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', animation: 'fadeInUp 1s ease-in-out' }}>
      <div><FontAwesomeIcon icon={faMapMarkerAlt} /> Location: {formData.location.country}, {formData.location.state}, {formData.location.city}</div>
      <div><FontAwesomeIcon icon={faLanguage} /> Language: {formData.language}</div>
      <div><FontAwesomeIcon icon={faTags} /> Category: {formData.category}</div>
      <div><FontAwesomeIcon icon={faUsers} /> Followers: {formData.followersCount}</div>
      <div><FontAwesomeIcon icon={faVideo} /> Videos: {formData.videosCount}</div>
      <div><FontAwesomeIcon icon={faChartLine} /> Engagement Rate: {formData.engagementRate}%</div>
      <div><FontAwesomeIcon icon={faEye} /> Average Views: {formData.averageViews}</div>
    </div>

    <div style={{ marginTop: '20px', animation: 'fadeInUp 1s ease-in-out' }}>
      <h3>Collaboration Rates</h3>
      <p>Sponsored Videos:<span className="text-indigo-600 font-bold"> ₹{formData.collaborationRates.sponsoredVideos}</span></p>
      <p>Product Reviews: <span className="text-indigo-600 font-bold">₹{formData.collaborationRates.productReviews}</span></p>
      <p>Shoutouts: <span className="text-indigo-600 font-bold">₹{formData.collaborationRates.shoutouts}</span></p>
    </div>

    <div style={{ marginTop: '20px', animation: 'fadeInUp 1s ease-in-out' }}>
      <h3>Audience Demographics</h3>
      <p>Age: {formData.audienceDemographics.age.join(', ')}</p>
      <p>Gender: {formData.audienceDemographics.gender.join(', ')}</p>
      <p>Geographic Distribution: {formData.audienceDemographics.geographicDistribution.join(', ')}</p>
    </div>

    {formData.mediaKit && (
      <a
        href={formData.mediaKit}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', marginTop: '20px', textAlign: 'center', color: '#007BFF', textDecoration: 'underline', animation: 'fadeInUp 1s ease-in-out' }}
      >
        View Media Kit
      </a>
    )}
    
    {/*<div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>*/}

<div style={{ marginTop: '25px' }}>
      <button onClick={() => SetShowApplication(true)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
      Apply
      </button>

      {showApplication && <ApplicationForm SetShowApplication={SetShowApplication}/>}
      </div>

      <div style={{ marginTop: '20px', animation: 'fadeInUp 1s ease-in-out' }}>
      <ReportModal
     section="YoutubeInfluencer"
           // isOpen={isModalOpen}
           // onClose={() => setIsModalOpen(false)}
            userId={userData._id}
            publisherId={id}
            localhosturl={localhosturl} 
          />
      </div>
  </div>
);
  
}

const styles = document.createElement('style');
styles.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styles);

export default YoutubeInfluencerProfile

