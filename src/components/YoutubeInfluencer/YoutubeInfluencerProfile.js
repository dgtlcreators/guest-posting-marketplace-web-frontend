import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import { FaArrowLeft, FaUser, FaLocationArrow, FaLanguage, FaChartBar } from 'react-icons/fa';
import { IoMdStats } from 'react-icons/io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faLanguage, faTags, faUsers, faVideo, faChartLine, faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Lottie from 'react-lottie';
//import animationData from '../animations/profileAnimation.json';
//const animationData="https://cdnl.iconscout.com/lottie/premium/preview-watermark/user-profile-girl-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--pretty-logo-beautiful-avatar-pack-people-icons-6633090.mp4"

const YoutubeInfluencerProfile = () => {
  const { isDarkTheme } = useTheme();
  const { userData } = useContext(UserContext);
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
    location: "",
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

  useEffect(() => {
     
    fetchInfluencers();
    
  }, []);
  const createDescriptionElements = (formData, users) => {
    const elements = [
      { key: 'Username', value: formData.username },
      { key: 'Full Name', value: formData.fullName },
      { key: 'Profile Picture', value: formData.profilePicture },
      { key: 'Bio', value: formData.bio },
      { key: 'Followers Count', value: formData.followersCount },
      { key: 'Following Count', value: formData.followingCount },
      { key: 'Posts Count', value: formData.postsCount },
      { key: 'Engagement Rate', value: `${formData.engagementRate}%` },
      { key: 'Average Likes', value: formData.averageLikes },
      { key: 'Average Comments', value: formData.averageComments },
      { key: 'Category', value: formData.category },
      { key: 'Location', value: formData.location },
      { key: 'Language', value: formData.language },
      { key: 'Verified Status', value: formData.verifiedStatus ? 'Verified' : 'Not Verified' },
      { key: 'Collaboration Rates (Post)', value: formData.collaborationRates.post },
      { key: 'Collaboration Rates (Story)', value: formData.collaborationRates.story },
      { key: 'Collaboration Rates (Reel)', value: formData.collaborationRates.reel },
      { key: 'Past Collaborations', value: formData.pastCollaborations.join(', ') },
      { key: 'Media Kit', value: formData.mediaKit },
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

  return `You viewed a YouTube Influencer ${shortElements.length>0?"with":""} ${shortElements.join(' and ')} successfully.`;
};

  const pastactivitiesAdd=async(users)=>{
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);
  
   try {
    const activityData={
      userId:userData?._id,
      action:"Viewed a YouTube Influencer",
      section:"YouTube Influencer",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"view",
        filter:{formData,total:users.length},
        description,
        shortDescription
        

      }
    }
    axios.post("https://guest-posting-marketplace-web-backend.onrender.com/pastactivities/createPastActivities", activityData)
  //  axios.post("http://localhost:5000/pastactivities/createPastActivities", activityData)
   } catch (error) {
    console.log(error);
    
   }
  }

  const fetchInfluencers=async()=>{
    const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/getYoutubeInfluencer/${id}`)
  //  const response = await axios.get(`http://localhost:5000/youtubeinfluencers/getYoutubeInfluencer/${id}`);
    try {
      setFormData(response.data.data);
      await pastactivitiesAdd(formData)
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  }

  /*const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, 
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };*/
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '10px', perspective: '1000px' }}>
    <button 
      style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
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
          : `https://guest-posting-marketplace-web-backend.onrender.com${formData.profilePicture}`
         // : `http://localhost:5000${formData.profilePicture}`
      }
        //src={formData.profilePicture || 'default-profile.png'}
        alt={`${formData.fullname}'s Profile`}
        style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '20px', transition: 'transform 0.3s' }}
      />
      <div>
        <h1 style={{ margin: '0' }}>{formData.fullname}</h1>
        <p>@{formData.username}</p>
      </div>
    </div>

    <p style={{ marginTop: '20px', animation: 'fadeIn 1s ease-in-out' }}>{formData.bio}</p>

    <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', animation: 'fadeInUp 1s ease-in-out' }}>
      <div><FontAwesomeIcon icon={faMapMarkerAlt} /> Location: {formData.location}</div>
      <div><FontAwesomeIcon icon={faLanguage} /> Language: {formData.language}</div>
      <div><FontAwesomeIcon icon={faTags} /> Category: {formData.category}</div>
      <div><FontAwesomeIcon icon={faUsers} /> Followers: {formData.followersCount}</div>
      <div><FontAwesomeIcon icon={faVideo} /> Videos: {formData.videosCount}</div>
      <div><FontAwesomeIcon icon={faChartLine} /> Engagement Rate: {formData.engagementRate}%</div>
      <div><FontAwesomeIcon icon={faEye} /> Average Views: {formData.averageViews}</div>
    </div>

    <div style={{ marginTop: '20px', animation: 'fadeInUp 1s ease-in-out' }}>
      <h3>Collaboration Rates</h3>
      <p>Sponsored Videos: ${formData.collaborationRates.sponsoredVideos}</p>
      <p>Product Reviews: ${formData.collaborationRates.productReviews}</p>
      <p>Shoutouts: ${formData.collaborationRates.shoutouts}</p>
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

/**import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faLanguage, faTags, faUsers, faVideo, faChartLine, faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Lottie from 'react-lottie';
import animationData from '../animations';  

const YoutubeInfluencerProfile = () => {
  const { isDarkTheme } = useTheme();
  const { userData } = useContext(UserContext);
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
    location: "",
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
  });

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/youtubeinfluencers/getYoutubeInfluencer/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <button 
        className="flex items-center mb-4 text-blue-500 hover:text-blue-700"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>

      <div 
        className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg transform transition-transform duration-500"
        onMouseMove={(e) => {
          const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
          const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
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
              : `http://localhost:5000${formData.profilePicture}`
          }
          alt={`${formData.fullname}'s Profile`}
          className="w-24 h-24 rounded-full mr-6 transform transition-transform hover:scale-110"
        />
        <div>
          <h1 className="text-2xl font-bold">{formData.fullname}</h1>
          <p className="text-gray-600">@{formData.username}</p>
        </div>
      </div>

      <p className="mt-4 text-gray-700 dark:text-gray-300">{formData.bio}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FontAwesomeIcon icon={faMapMarkerAlt} /> Location: {formData.location}</div>
        <div><FontAwesomeIcon icon={faLanguage} /> Language: {formData.language}</div>
        <div><FontAwesomeIcon icon={faTags} /> Category: {formData.category}</div>
        <div><FontAwesomeIcon icon={faUsers} /> Followers: {formData.followersCount}</div>
        <div><FontAwesomeIcon icon={faVideo} /> Videos: {formData.videosCount}</div>
        <div><FontAwesomeIcon icon={faChartLine} /> Engagement Rate: {formData.engagementRate}%</div>
        <div><FontAwesomeIcon icon={faEye} /> Average Views: {formData.averageViews}</div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Collaboration Rates</h3>
        <p>Sponsored Videos: ${formData.collaborationRates.sponsoredVideos}</p>
        <p>Product Reviews: ${formData.collaborationRates.productReviews}</p>
        <p>Shoutouts: ${formData.collaborationRates.shoutouts}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Audience Demographics</h3>
        <p>Age: {formData.audienceDemographics.age.join(', ')}</p>
        <p>Gender: {formData.audienceDemographics.gender.join(', ')}</p>
        <p>Geographic Distribution: {formData.audienceDemographics.geographicDistribution.join(', ')}</p>
      </div>

      {formData.mediaKit && (
        <a
          href={formData.mediaKit}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-6 text-center text-blue-500 hover:text-blue-700"
        >
          View Media Kit
        </a>
      )}

      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};

export default YoutubeInfluencerProfile;
 */