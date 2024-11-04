import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import YoutubeInfluencerTable from "./YoutubeInfluencerTable"
import SaveSearch from "../OtherComponents/SaveSearch.js";
import { useLocation } from 'react-router-dom';
import LocationSelector from '../OtherComponents/LocationSelector.js';

const YoutubeInfluencer = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const initialFormData = {
    username: "",
    fullname: "",
    followersCountFrom: "",
    followersCountTo: "",
    videosCountFrom: "",
    videosCountTo: "",
    engagementRateFrom: "",
    engagementRateTo: "",
    averageViewsFrom: "",
    averageViewsTo: "",
    category: "",
    // location: "",
    location: {
      country: "",
      state: "",
      city: ""
    },
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

      const response = await axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`);


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
  const handleLocationSelect1 = (location) => {
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
  const handleChange = (e) => {
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


  const pastactivitiesAdd = async (users) => {
    const description = [
      formData.username ? `Username: ${formData.username}` : '',
      formData.fullname ? `Fullname: ${formData.fullname}` : '',
      formData.followersCountFrom || formData.followersCountTo ? `Followers Count from ${formData.followersCountFrom || 'N/A'} to ${formData.followersCountTo || 'N/A'}` : '',
      formData.videosCountFrom || formData.videosCountTo ? `Videos Count from ${formData.videosCountFrom || 'N/A'} to ${formData.videosCountTo || 'N/A'}` : '',
      formData.engagementRateFrom || formData.engagementRateTo ? `Engagement Rate from ${formData.engagementRateFrom || 'N/A'} to ${formData.engagementRateTo || 'N/A'}` : '',
      formData.averageViewsFrom || formData.averageViewsTo ? `Average Views from ${formData.averageViewsFrom || 'N/A'} to ${formData.averageViewsTo || 'N/A'}` : '',
      formData.category ? `Category: ${formData.category}` : '',
      formData.location ? `Location: ${formData.location}` : '',
      formData.language ? `Language: ${formData.language}` : '',
      formData.collaborationRates.sponsoredVideosFrom || formData.collaborationRates.sponsoredVideosTo ? `Sponsored Videos from ${formData.collaborationRates.sponsoredVideosFrom || 'N/A'} to ${formData.collaborationRates.sponsoredVideosTo || 'N/A'}` : '',
      formData.collaborationRates.productReviewsFrom || formData.collaborationRates.productReviewsTo ? `Product Reviews from ${formData.collaborationRates.productReviewsFrom || 'N/A'} to ${formData.collaborationRates.productReviewsTo || 'N/A'}` : '',
      formData.collaborationRates.shoutoutsFrom || formData.collaborationRates.shoutoutsTo ? `Shoutouts from ${formData.collaborationRates.shoutoutsFrom || 'N/A'} to ${formData.collaborationRates.shoutoutsTo || 'N/A'}` : '',
      formData.pastCollaborations ? `Past Collaborations: ${formData.pastCollaborations}` : '',
      formData.audienceDemographics.age ? `Audience Age: ${formData.audienceDemographics.age}` : '',
      formData.audienceDemographics.gender ? `Audience Gender: ${formData.audienceDemographics.gender}` : '',
      formData.audienceDemographics.geographicDistribution ? `Geographic Distribution: ${formData.audienceDemographics.geographicDistribution}` : '',
      `Total results: ${users.length}`
    ]
      .filter(Boolean)
      .join(', ');

    // const shortDescription = `You searched Followers Count from ${formData.followersCountFrom || 'N/A'} to ${formData.followersCountTo || 'N/A'}, Engagement Rate from ${formData.engagementRateFrom || 'N/A'} to ${formData.engagementRateTo || 'N/A'}, Average Views from ${formData.averageViewsFrom || 'N/A'} to ${formData.averageViewsTo || 'N/A'}, and got ${users.length} results`;
    const shortDescription = `You searched ${formData.followersCountFrom ? 'Followers Count' : 'Engagement Rate'} from ${formData.followersCountFrom || formData.engagementRateFrom} to ${formData.followersCountTo || formData.engagementRateTo} and got ${users.length} results`;
    try {
      const activityData = {
        userId: userData?._id,
        action: "Performed a search for YouTube Influencer",//"Searched for Instagram Influencers",
        section: "YouTube Influencer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "filter",
          filter: { formData, total: users.length },
          description,
          shortDescription


        }
      }


      axios.post(`${localhosturl}/pastactivities/createPastActivities`, activityData)
    } catch (error) {
      console.log(error);

    }
  }

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios
        //.post("https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/youtubeInfluencesFilter", formData)
        .post(`${localhosturl}/youtubeinfluencers/youtubeInfluencesFilter`, formData)
      // console.log(response.data.data);
      console.log(response.data.data)
      setInfluencers(response.data.data);
      pastactivitiesAdd(response.data.data);
      toast.success("Data Fetch Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  /*const handleSubmit = (e) => {
    e.preventDefault()
   // console.log(formData)
    axios
     // .post("https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/youtubeInfluencesFilter", formData)
       .post("http://localhost:5000/youtubeinfluencers/youtubeInfluencesFilter", formData)
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
  */

  const location = useLocation();
  const [toastShown, setToastShown] = useState(false);
  useEffect(() => {
    if (location?.state?.formData) {
      const formData = location.state.formData;

      const flattenedFormData = formData["0"] || formData;
      console.log("Flattened FormData", flattenedFormData);

      setFormData(prevState => ({
        ...initialFormData,
        ...flattenedFormData
      }));
      fetchUsers(formData)
      location.state.formData = null;
    }
  }, [location?.state?.formData]);

  const fetchUsers = async (formData) => {
    try {
      const response = await axios.post(
        `${localhosturl}/youtubeinfluencers/youtubeInfluencesFilter`

        , formData);
      console.log("Fetched data:", response.data.data);
      setInfluencers(response.data.data);


      if (!toastShown) {
        toast.success("Saved Data Fetch Successfully");
        setToastShown(true);
      }
      // toast.success("Saved Data Fetch Successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error(error.message);
    }
  }

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };


  return (
    <div className='p-4 max-w-6xl mx-auto overflow-x-auto'>
      <h2 className='text-2xl  p-2'// text-white bg-blue-700
      >FAQ</h2>
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-xl p-4 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/*<div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="focus:outline focus:outline-blue-400 p-2"
          />
        </div>*/}
          <div className="flex flex-col">
            <label htmlFor="fullname">Fullname</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="followersCountFrom">Followers Count From</label>
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
          <LocationSelector onSelectLocation={handleLocationSelect} />
          {/* <div className="flex flex-col">
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
          </div>*/}
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
          {/*<div className="flex flex-col">
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
        </div>*/}
        </div>
        <div className="flex items-center justify-end space-x-2 mt-3">
          <SaveSearch section="YoutubeInfluencer" formDataList={formData} />
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105"
          >
            Reset
          </button>
          <button
            disabled={!userData.permissions.youtube.filter}
            title={!userData.permissions.youtube.filter
              ? "You are not allowed to access this feature"
              : undefined  // : ""
            }
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h2 className="text-xl p-2 my-2"// text-white bg-blue-700 
        >
          Influencer List
        </h2>

        <YoutubeInfluencerTable influencers={influencers} setInfluencers={setInfluencers} />

      </div>


    </div>

  )
}

export default YoutubeInfluencer