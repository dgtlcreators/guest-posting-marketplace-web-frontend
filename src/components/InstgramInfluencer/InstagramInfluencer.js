import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InstagramInfluencerTable from "./InstagramInfluencerTable.js"; 
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext.js";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider.js";
import SaveSearch from "../OtherComponents/SaveSearch.js";




const InstagramInfluencer = () => {
  const { isDarkTheme } = useTheme();

  const { userData ,localhosturl} = useContext(UserContext); 
  const userId = userData?._id;

  const initialFormData = {
    username: "",
    fullName:"",
    followersCountFrom: "",
    followersCountTo: "",
    engagementRateFrom: "",
    engagementRateTo: "",
    category: "",
    location: "",
    language: "",
    verifiedStatus: "",
    collaborationRates: {
      postFrom: "",
      postTo: "",
      storyFrom: "",
      storyTo: "",
      reelFrom: "",
      reelTo: ""
    },
  
  
    userId: userId
  };

  const [formData, setFormData] = useState(initialFormData);
  const [influencers, setInfluencers] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [bookmarkedInfluencers, setBookmarkedInfluencers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);


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
  };
  

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



  useEffect(() => {
        
    //fetchInfluencers();
    //fetchSavedSearches();
   // fetchBookmarkedInfluencers();
   // fetchRecentActivities();
  }, []);

  const fetchInfluencers = async () => {
    try {
      
      const response = await axios.get(`${localhosturl}/instagraminfluencers/getAllInstagraminfluencer`);
     
   
      setInfluencers(response.data.instagramInfluencer);
     // setOriginalUsers(response.data.instagramInfluencer);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  };
  const fetchSavedSearches = async () => {
    try {

      const response = await axios.get(`${localhosturl}/user/${userId}/savedSearches`);
      setSavedSearches(response.data.savedSearches);
    } catch (error) {
      console.error("Error fetching saved searches", error);
    }
  };

  const fetchBookmarkedInfluencers = async () => {
    try {
     
      const response = await axios.get(`${localhosturl}/user/${userId}/bookmarkedInfluencers`);
      setBookmarkedInfluencers(response.data.bookmarkedInfluencers);
    } catch (error) {
      console.error("Error fetching bookmarked influencers", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      
      const response = await axios.get(`${localhosturl}/user/${userId}/recentActivities`);
      setRecentActivities(response.data.recentActivities);
    } catch (error) {
      console.error("Error fetching recent activities", error);
    }
  };
  const saveSearchQuery = async () => {
    try {
    
      await axios.post(`${localhosturl}/savedSearches`, {
        userId: userId,
        searchQuery: formData,
      });
      toast.success("Search query saved");
    } catch (error) {
      toast.error("Failed to save search query");
    }
  };
  const bookmarkInfluencer = async (influencerId) => {
    try {
      
        await axios.post(`${localhosturl}/bookmarkedInfluencers`, {
        userId: userId,
        influencerId: influencerId,
      });
      toast.success("Influencer bookmarked");
    } catch (error) {
      toast.error("Failed to bookmark influencer");
    }
  };
  

  const recordRecentActivity = async (activity) => {
    try {
     
        await axios.post(`${localhosturl}/recentActivities`, {
        userId: userId,
        activity: activity,
      });
      toast.success("Activity recorded");
    } catch (error) {
      toast.error("Failed to record activity");
    }
  };

  
  
  
  const handleReset = () => {
    setFormData(initialFormData);
  };

  axios.defaults.withCredentials = true;

  const pastactivitiesAdd=async(users)=>{
    const description = [
      formData.username ? `Username: ${formData.username}` : '',
      formData.fullName ? `Fullname: ${formData.fullName}` : '',
      formData.followersCountFrom || formData.followersCountTo ? `Followers Count from ${formData.followersCountFrom || 'N/A'} to ${formData.followersCountTo || 'N/A'}` : '',
      formData.engagementRateFrom || formData.engagementRateTo ? `Engagement Rate from ${formData.engagementRateFrom || 'N/A'} to ${formData.engagementRateTo || 'N/A'}` : '',
      formData.category ? `Category: ${formData.category}` : '',
      formData.location ? `Location: ${formData.location}` : '',
      formData.language ? `Language: ${formData.language}` : '',
      formData.verifiedStatus ? `Verified Status: ${formData.verifiedStatus}` : '',
      formData.collaborationRates.postFrom || formData.collaborationRates.postTo ? `Post Collaboration Rates from ${formData.collaborationRates.postFrom || 'N/A'} to ${formData.collaborationRates.postTo || 'N/A'}` : '',
      formData.collaborationRates.storyFrom || formData.collaborationRates.storyTo ? `Story Collaboration Rates from ${formData.collaborationRates.storyFrom || 'N/A'} to ${formData.collaborationRates.storyTo || 'N/A'}` : '',
      formData.collaborationRates.reelFrom || formData.collaborationRates.reelTo ? `Reel Collaboration Rates from ${formData.collaborationRates.reelFrom || 'N/A'} to ${formData.collaborationRates.reelTo || 'N/A'}` : '',
      `Total results: ${users.length}`
    ]
    .filter(Boolean)
    .join(', ');
    const shortDescription=`You searched ${formData.followersCountFrom ? 'Followers Count' : 'Engagement Rate'} from ${formData.followersCountFrom || formData.engagementRateFrom} to ${formData.followersCountTo || formData.engagementRateTo} and got ${users.length} results`;

   try {
    const activityData={
      userId:userData?._id,
      action:"Performed a search for Instagram Influencers",//"Searched for Instagram Influencers",
      section:"Instagram Influencer",
      role:userData?.role,
      timestamp:new Date(),
      details:{
        type:"filter",
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
   /*const pastactivitiesAdd=async()=>{
    try {
     const activityData={
       userId:userData?._id,
       userName:userData?.name,
      // userEmail:
       action:"Searched for Instagram Influencers",
       section:"Guest Post",
       role:userData?.role,
       timestamp:new Date(),
       details:{
         filter:{formData,total:influencers.length},
 
       }
     }
     axios.post("http://localhost:5000/pastactivities/createPastActivities", activityData)
    } catch (error) {
     console.log(error);
     
    }
   }
  
 const handleSubmit = (e) => {
    e.preventDefault();
    pastactivitiesAdd()
    //console.log(formData)
    const formDataToSend = {
      ...formData,
      verifiedStatus:formData.verifiedStatus===""?"": formData.verifiedStatus === 'verified',
    };
    
    axios
      //.post("https://guest-posting-marketplace-web-backend.onrender.com/userbrand/filter", formData)
      .post("http://localhost:5000/userbrand/filter", formDataToSend)
      .then((response) => {
        console.log(response.data);
        setInfluencers(response.data);
        toast.success("Data Fetch Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };*/

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {

      const formDataToSend = {
        ...formData,userId:userData?._id,
        verifiedStatus:formData.verifiedStatus===""?"": formData.verifiedStatus === 'verified',
      };
      
      const response = await axios
        
        .post(`${localhosturl}/userbrand/filter`, formDataToSend)
       
          console.log(response.data);
          setInfluencers(response.data);
          pastactivitiesAdd(response.data);
          toast.success("Data Fetch Successfully")
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }



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
      if (location && location.state) {
      //  location.state = null;
      }
    }
  }, [location?.state?.formData]);
  
const fetchUsers=async(formData)=>{
  try {
    const formDataToSend = {
      ...formData,
      verifiedStatus:formData.verifiedStatus===""?"": formData.verifiedStatus === 'verified',
    };
    //console.log("formData  checling in fetchUser ",formData)
    const response = await axios.post(`${localhosturl}/userbrand/filter`,formData);
   // console.log("Fetched data saved:", response.data);
    setInfluencers(response.data);
//console.log("Influencers after ",influencers)
   
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

  return (
    <>
   
    <div className="p-4 max-w-6xl mx-auto overflow-x-auto">
     { /*<h1 className="text-2xl text-white bg-blue-700 p-2 my-2">Influencer Filter</h1>*/}
     <h1 className="text-2xl   p-2 my-2">FAQ</h1>
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-xl p-4 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Username 
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
          */}
           <div className="flex flex-col">
            <label htmlFor="fullName">FullName</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          {/* Followers Count From */}
          <div className="flex flex-col">
            <label htmlFor="followersCountFrom">Followers Count From</label>
            <input
              type="number"
              id="followersCountFrom"
              name="followersCountFrom"
              min="0"
              value={formData.followersCountFrom}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          {/* Followers Count To */}
          <div className="flex flex-col">
            <label htmlFor="followersCountTo">Followers Count To</label>
            <input
              type="number"
              id="followersCountTo"
              name="followersCountTo"
              min="0"
              value={formData.followersCountTo}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          {/* Engagement Rate From */}
          <div className="flex flex-col">
            <label htmlFor="engagementRateFrom">Engagement Rate From</label>
            <input
              type="number"
              id="engagementRateFrom"
              name="engagementRateFrom"
              min="0"
              step="0.01"
              value={formData.engagementRateFrom}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          {/* Engagement Rate To */}
          <div className="flex flex-col">
            <label htmlFor="engagementRateTo">Engagement Rate To</label>
            <input
              type="number"
              id="engagementRateTo"
              name="engagementRateTo"
              min="0"
              step="0.01"
              value={formData.engagementRateTo}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
          <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="">All</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Animals and Pets">Animals and Pets</option>
              <option value="Art">Art</option>
              <option value="Automobiles">Automobiles</option>
              <option value="Business">Business</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
              <option value="Career and Employment">Career and Employment</option>
              <option value="Computer">Computer</option>
              <option value="Construction and Repairs">Construction and Repairs</option>
              <option value="Culture">Culture</option>
              <option value="Ecommerce">E-commerce</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Environment">Environment</option>
              <option value="Fashion">Fashion</option>
              <option value="Finance">Finance</option>
              <option value="Web Development">Web Development</option>
              <option value="App Development">App Development</option>
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col">
           {/* <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />*/}
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

          {/* Language */}
          <div className="flex flex-col">
          <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="">All</option>
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
            </select>
          </div>

          {/* Verified Status */}
          <div className="flex flex-col">
            <label htmlFor="verifiedStatus">Verified Status</label>
            <select
              id="verifiedStatus"
              name="verifiedStatus"
              value={formData.verifiedStatus}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Collaboration Rates */}
          <div className="flex flex-col">
            <label htmlFor="collaborationRates.postFrom">Collaboration Rate for Post (From)</label>
            <input
              type="number"
              id="collaborationRates.postFrom"
              name="collaborationRates.postFrom"
              min="0"
              value={formData.collaborationRates.postFrom}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="collaborationRates.postTo">Collaboration Rate for Post (To)</label>
            <input
              type="number"
              id="collaborationRates.postTo"
              name="collaborationRates.postTo"
              min="0"
              value={formData.collaborationRates.postTo}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="collaborationRates.storyFrom">Collaboration Rate for Story (From)</label>
            <input
              type="number"
              id="collaborationRates.storyFrom"
              name="collaborationRates.storyFrom"
              min="0"
              value={formData.collaborationRates.storyFrom}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="collaborationRates.storyTo">Collaboration Rate for Story (To)</label>
            <input
              type="number"
              id="collaborationRates.storyTo"
              name="collaborationRates.storyTo"
              min="0"
              value={formData.collaborationRates.storyTo}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="collaborationRates.reelFrom">Collaboration Rate for Reel (From)</label>
            <input
              type="number"
              id="collaborationRates.reelFrom"
              name="collaborationRates.reelFrom"
              min="0"
              value={formData.collaborationRates.reelFrom}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="collaborationRates.reelTo">Collaboration Rate for Reel (To)</label>
            <input
              type="number"
              id="collaborationRates.reelTo"
              name="collaborationRates.reelTo"
              min="0"
              value={formData.collaborationRates.reelTo}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-3">       
           <SaveSearch  section="InstagramInfluencer" formDataList={formData}/>
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105"
          >
            Reset
          </button>
          <button
          disabled={!userData.permissions.instagram.filter}
          title={!userData.permissions.instagram.filter
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

      {
      /*
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-xl p-4 relative"
      >
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
            <label htmlFor="followersCount">Followers Count</label>
            <input
              type="number"
              id="followersCount"
              name="followersCount"
              min="0"
              value={formData.followersCount}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="engagementRate">Engagement Rate</label>
            <input
              type="number"
              id="engagementRate"
              name="engagementRate"
              min="0"
              step="0.01"
              value={formData.engagementRate}
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
              <option value="">All</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Animals and Pets">Animals and Pets</option>
              <option value="Art">Art</option>
              <option value="Automobiles">Automobiles</option>
              <option value="Business">Business</option>
              <option value="Books">Books</option>
              <option value="Beauty">Beauty</option>
              <option value="Career and Employment">Career and Employment</option>
              <option value="Computer">Computer</option>
              <option value="Construction and Repairs">Construction and Repairs</option>
              <option value="Culture">Culture</option>
              <option value="Ecommerce">E-commerce</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Environment">Environment</option>
              <option value="Fashion">Fashion</option>
              <option value="Finance">Finance</option>
              <option value="Web Development">Web Development</option>
              <option value="App Development">App Development</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
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
              <option value="">All</option>
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
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="verifiedStatus">Verified Status</label>
            <select
              id="verifiedStatus"
              name="verifiedStatus"
              value={formData.verifiedStatus}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-4">
          <div className="flex flex-col">
            <label htmlFor="collaborationRatePost">Collaboration Rate (Post)</label>
            <input
              type="number"
              id="collaborationRatePost"
              name="collaborationRatePost"
              min="0"
              value={formData.collaborationRatePost}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="collaborationRateStory">Collaboration Rate (Story)</label>
            <input
              type="number"
              id="collaborationRateStory"
              name="collaborationRateStory"
              min="0"
              value={formData.collaborationRateStory}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="collaborationRateReel">Collaboration Rate (Reel)</label>
            <input
              type="number"
              id="collaborationRateReel"
              name="collaborationRateReel"
              min="0"
              value={formData.collaborationRateReel}
              onChange={handleChange}
              className="focus:outline focus:outline-blue-400 p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>
      </form>*/}

      {//influencers.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl   p-2 my-2"// text-white bg-blue-700 
        >
          Instagram Influencer List
          </h2>
          <InstagramInfluencerTable influencers={influencers} setInfluencers={setInfluencers} />
        </div>
      //)
      }
    </div>
    </>
  );
};

export default InstagramInfluencer;





