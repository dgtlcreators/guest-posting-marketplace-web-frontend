import axios from "axios";
import { useContext, useEffect, useState } from "react";
import BrandUserTable from "./BrandUserTable.js"; // Component to display influencers
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext.js";
import { Link } from "react-router-dom";

const BrandUser = () => {
  const { userData } = useContext(UserContext); 
  const userId = userData?._id;

  const initialFormData = {
    username: "",
    followersCount: "",
    followingCount: "",
    engagementRate: "",
    category: "",
    location: "",
    language: "",
    verifiedStatus: "",
    collaborationRatePost: "",
    collaborationRateStory: "",
    collaborationRateReel: "",
    userId: userId
  };

  const [formData, setFormData] = useState(initialFormData);
  const [influencers, setInfluencers] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [bookmarkedInfluencers, setBookmarkedInfluencers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(() => {
        
    fetchInfluencers();
    //fetchSavedSearches();
   // fetchBookmarkedInfluencers();
   // fetchRecentActivities();
  }, []);

  const fetchInfluencers = async () => {
    try {
      
     // const response = await axios.get("http://localhost:5000/instagraminfluencers/getAllInstagraminfluencer");
      const response = await axios.get("https://guest-posting-marketplace-web-backend.onrender.com/instagraminfluencers/getAllInstagraminfluencer");
    //console.log(response.data.instagramInfluencer)
      setInfluencers(response.data.instagramInfluencer);
     // setOriginalUsers(response.data.instagramInfluencer);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  };
  const fetchSavedSearches = async () => {
    try {
      const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/user/${userId}/savedSearches`);
     // const response = await axios.get(`http://localhost:5000/user/${userId}/savedSearches`);
      setSavedSearches(response.data.savedSearches);
    } catch (error) {
      console.error("Error fetching saved searches", error);
    }
  };

  const fetchBookmarkedInfluencers = async () => {
    try {
      const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/user/${userId}/bookmarkedInfluencers`);
      //const response = await axios.get(`http://localhost:5000/user/${userId}/bookmarkedInfluencers`);
      setBookmarkedInfluencers(response.data.bookmarkedInfluencers);
    } catch (error) {
      console.error("Error fetching bookmarked influencers", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/user/${userId}/recentActivities`);
      //const response = await axios.get(`http://localhost:5000/user/${userId}/recentActivities`);
      setRecentActivities(response.data.recentActivities);
    } catch (error) {
      console.error("Error fetching recent activities", error);
    }
  };
  const saveSearchQuery = async () => {
    try {
      await axios.post("https://guest-posting-marketplace-web-backend.onrender.com/savedSearches", {
      //await axios.post("http://localhost:5000/savedSearches", {
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
      await axios.post("https://guest-posting-marketplace-web-backend.onrender.com/bookmarkedInfluencers", {
       // await axios.post("http://localhost:5000/bookmarkedInfluencers", {
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
      await axios.post("https://guest-posting-marketplace-web-backend.onrender.com/recentActivities", {
        //await axios.post("http://localhost:5000/recentActivities", {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post("https://guest-posting-marketplace-web-backend.onrender.com/userbrand/filter", formData)
    //  .post("http://localhost:5000/userbrand/filter", formData)
      .then((response) => {
        console.log(response.data);
        setInfluencers(response.data);
        toast.success("Data Fetch Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <>
   
    <div className="p-4 max-w-6xl mx-auto overflow-x-auto">
      <h1 className="text-2xl text-white bg-blue-700 p-2 my-2">Influencer Filter</h1>

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
      </form>

      {influencers.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl text-white bg-blue-700 p-2 my-2">
          Influencer List
          </h2>
          <BrandUserTable influencers={influencers} setInfluencers={setInfluencers} />
        </div>
      )}
    </div>
    </>
  );
};

export default BrandUser;





