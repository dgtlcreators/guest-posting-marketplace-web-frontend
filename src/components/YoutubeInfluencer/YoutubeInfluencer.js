import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import YoutubeInfluencerTable from "./YoutubeInfluencerTable"

const YoutubeInfluencer = () => {
  const { isDarkTheme } = useTheme();
  const { userData } = useContext(UserContext);
  const userId = userData?._id;
  const initialFormData = {
    username: "",
    followersCountFrom: "",
    followersCountTo: "",
    videosCountFrom: "",
    videosCountTo: "",
    engagementRateFrom: "",
    engagementRateTo: "",
    averageViewsFrom: "",
    averageViewsTo: "",
    category: "",
    location: "",
    language: "",
    collaborationRates: {
      sponsoredVideosFrom: "",
      sponsoredVideosTo: "",
      productReviewsFrom: "",
      productReviewsTo: "",
      shoutoutsFrom: "",
      shoutoutsTo: ""
    },
    pastCollaborations: "",
    audienceDemographics: {
      age: "",
      gender: "",
      geographicDistribution: ""
    },
    userId: userId
  }
  const [formData, setFormData] = useState(initialFormData);
  const [influencers, setInfluencers] = useState([]);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);

  useEffect(() => {
    fetchInfluencers();
  })
  const fetchInfluencers = async () => {
    try {
      
     // const response = await axios.get("http://localhost:5000/youtubeinfluencers/getAllYoutubeInfluencer");
      const response = await axios.get("https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/getAllYoutubeInfluencer");
  
    //  setInfluencers(response.data.data);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  }

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocationQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(`https://us1.locationiq.com/v1/search.php`, {
          params: {
            key: 'pk.9a061732949f134d1a74e2f7220fad7a',
            q: query,
            format: 'json'
          }
        });
        setLocationResults(response.data);
      } catch (error) {
        console.error("Error fetching location data", error);
      }
    } else {
      setLocationResults([]);
    }
  };
  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: location.display_name,
    }));
    setLocationQuery(location.display_name);
    setLocationResults([]);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };
  const handleChange=(e)=>{
    const { name, value } = e.target;
    const nameArray = name.split('.');

    if (nameArray.length === 1) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [nameArray[0]]: {
          ...formData[nameArray[0]],
          [nameArray[1]]: value,
        },
      });
    }
  }
  const handleDemographicsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      audienceDemographics: {
        ...prevState.audienceDemographics,
        [name]: value,
      },
    }));
  };
  

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault()
   // console.log(formData)
    axios
      .post("https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/youtubeInfluencesFilter", formData)
    //   .post("http://localhost:5000/youtubeinfluencers/youtubeInfluencesFilter", formData)
      .then((response) => {
       // console.log(response.data.data);
        setInfluencers(response.data.data);
        toast.success("Data Fetch Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }

  return (
    <div className='p-4 max-w-6xl mx-auto overflow-x-auto'>
      <h1 className='text-2xl text-white bg-blue-700 p-2'>FAQ</h1>
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-xl p-4 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="followersCountFrom">followers Count From</label>
          <input
            type="number"
            id="followersCountFrom"
            name="followersCountFrom"
            value={formData.followersCountFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="followersCountTo">Followers Count To</label>
          <input
            type="number"
            id="followersCountTo"
            name="followersCountTo"
            value={formData.followersCountTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="videosCountFrom">Videos Count From</label>
          <input
            type="number"
            id="videosCountFrom"
            name="videosCountFrom"
            value={formData.videosCountFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="videosCountTo">Videos Count To</label>
          <input
            type="number"
            id="videosCountTo"
            name="videosCountTo"
            value={formData.videosCountTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="engagementRateFrom">Engagement Rate From</label>
          <input
            type="number"
            id="engagementRateFrom"
            name="engagementRateFrom"
            value={formData.engagementRateFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="engagementRateTo">Engagement Rate To</label>
          <input
            type="number"
            id="engagementRateTo"
            name="engagementRateTo"
            value={formData.engagementRateTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="averageViewsFrom">Average Views From</label>
          <input
            type="number"
            id="averageViewsFrom"
            name="averageViewsFrom"
            value={formData.averageViewsFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="averageViewsTo">Average Views To</label>
          <input
            type="number"
            id="averageViewsTo"
            name="averageViewsTo"
            value={formData.averageViewsTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="All">All</option>
             <option value="Technology">Technology</option>
               <option value="Beauty and Fashion">Beauty and Fashion</option>
               <option value="Gaming">Gaming</option>
               <option value="Health and Fitness">Health and Fitness</option>
               <option value="Food and Cooking">Food and Cooking</option>
               <option value="Travel and Adventure">Travel and Adventure</option>
               <option value="Lifestyle">Lifestyle</option>
               <option value="Education">Education</option>
               <option value="Entertainment and Comedy">Entertainment and Comedy</option>
               <option value="Music and Dance">Music and Dance</option>
               <option value="Parenting and Family">Parenting and Family</option>
               <option value="Finance and Business">Finance and Business</option>
               <option value="DIY and Crafting">DIY and Crafting</option>
               <option value="Sports and Outdoors">Sports and Outdoors</option>
               <option value="Automotive">Automotive</option>
               <option value="Pet Care and Animals">Pet Care and Animals</option>
               <option value="Photography and Videography">Photography and Videography</option>
               <option value="Home and Garden">Home and Garden</option>
               <option value="Art and Design">Art and Design</option>
               <option value="Books and Literature">Books and Literature</option>
               <option value="Mental Health and Self-Care">Mental Health and Self-Care</option>
               <option value="History and Culture">History and Culture</option>
            </select>
        </div>
        <div className="flex flex-col">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Search Location"
              value={locationQuery}
              onChange={handleLocationChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
             {locationResults.length > 0 && (
              <ul className="mt-2 border border-gray-300 rounded w-full bg-white max-h-40 overflow-auto">
                {locationResults.map((location) => (
                  <li
                    key={location.place_id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location.display_name}
                  </li>
                ))}
              </ul>
            )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
               <option value="All">All</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Urdu">Urdu</option>
              <option value="Odia">Odia</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
              <option value="Kannada">Kannada</option>
              <option value="Other">Other</option>
            </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="collaborationRates.sponsoredVideosFrom">Collaboration Rates for sponsored Videos (From)</label>
          <input
            type="number"
            id="collaborationRates.sponsoredVideosFrom"
            name="collaborationRates.sponsoredVideosFrom"
            value={formData.collaborationRates.sponsoredVideosFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="collaborationRates.sponsoredVideosTo">Collaboration Rates for sponsored Videos (To)</label>
          <input
            type="number"
            id="collaborationRates.sponsoredVideosTo"
            name="collaborationRates.sponsoredVideosTo"
            value={formData.collaborationRates.sponsoredVideosTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="collaborationRates.productReviewsFrom">Collaboration Rates for product Reviews (From)</label>
          <input
            type="number"
            id="collaborationRates.productReviewsFrom"
            name="collaborationRates.productReviewsFrom"
            value={formData.collaborationRates.productReviewsFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="collaborationRates.productReviewsTo">Collaboration Rates for product Reviews (To)</label>
          <input
            type="number"
            id="collaborationRates.productReviewsTo"
            name="collaborationRates.productReviewsTo"
            value={formData.collaborationRates.productReviewsTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="collaborationRates.shoutoutsFrom">Collaboration Rates for shoutouts (From)</label>
          <input
            type="number"
            id="collaborationRates.shoutoutsFrom"
            name="collaborationRates.shoutoutsFrom"
            value={formData.collaborationRates.shoutoutsFrom}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="collaborationRates.shoutoutsTo">Collaboration Rates for shoutouts (To)</label>
          <input
            type="number"
            id="collaborationRates.shoutoutsTo"
            name="collaborationRates.shoutoutsTo"
            value={formData.collaborationRates.shoutoutsTo}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pastCollaborations">Past Collaborations</label>
          <textarea
            
            id="pastCollaborations"
            name="pastCollaborations"
            value={formData.pastCollaborations}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="audienceDemographics.age">Audience Demographics - Age:</label>
          <textarea
           
            id="audienceDemographics.age"
            name="audienceDemographics.age"
            value={formData.audienceDemographics.age}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="audienceDemographics.gender">Audience Demographics - Gender:</label>
          <textarea
           
            id="audienceDemographics.gender"
            name="audienceDemographics.gender"
            value={formData.audienceDemographics.gender}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="audienceDemographics.geographicDistribution">Audience Demographics - Geographic Distribution:</label>
          <textarea
           
            id="audienceDemographics.geographicDistribution"
            name="audienceDemographics.geographicDistribution"
            value={formData.audienceDemographics.geographicDistribution}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>
      </div>
      <div className="flex-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded">
          Search
        </button>
        <button type="button" onClick={handleReset} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 ml-4 rounded">
          Reset
        </button>
      </div>
      </form>
      {influencers.length > 0 &&
        <div className="mt-4">
          <h2 className="text-xl text-white bg-blue-700 p-2 my-2">
          Influencer List
          </h2>
          
          <YoutubeInfluencerTable influencers={influencers} setInfluencers={setInfluencers} />
        
        </div>
        
      }
    </div>

  )
}

export default YoutubeInfluencer