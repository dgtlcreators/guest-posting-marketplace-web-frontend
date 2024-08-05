import React, { useState, useEffect } from "react";
import axios from "axios";
import InstagramInfluencerTable from "./InstagramInfluencerTable";
import { toast } from "react-toastify";

const InstagramInfluencer = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    profilePicture: "",
    bio: "",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    engagementRate: 0,
    averageLikes: 0,
    averageComments: 0,
    category: "",
    location: "",
    language: "",
    verifiedStatus: false,
    collaborationRates: { post: 0, story: 0, reel: 0 },
    pastCollaborations: [],
    mediaKit: "",
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);


  const [profileUrlOption, setProfileUrlOption] = useState("manual");
  const [mediaKitOption, setMediaKitOption] = useState("manual");
  const [addInfluencer, setAddInfluencer] = useState([]);

  

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('collaborationRates')) {
      const key = name.split('.')[1]; 
      setFormData((prev) => ({
        ...prev,
        collaborationRates: {
          ...prev.collaborationRates,
          [key]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name === 'pastCollaborations') {
      setFormData((prev) => ({
        ...prev,
        pastCollaborations: value.split(',').map((item) => item.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
      }));
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
  


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(files,files[0])
    setFormData((prev) => ({
      ...prev,
      [name]: files[0].name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formdata: ",formData)
    console.log("collaborationRates.post",formData.collaborationRates.post)
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("followersCount", formData.followersCount);
    formDataToSend.append("followingCount", formData.followingCount);
    formDataToSend.append("postsCount", formData.postsCount);
    formDataToSend.append("engagementRate", formData.engagementRate);
    formDataToSend.append("averageLikes", formData.averageLikes);
    formDataToSend.append("averageComments", formData.averageComments);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("verifiedStatus", formData.verifiedStatus);
    formDataToSend.append("collaborationRates[post]", formData.collaborationRates.post);
    formDataToSend.append("collaborationRates[story]", formData.collaborationRates.story);
    formDataToSend.append("collaborationRates[reel]", formData.collaborationRates.reel);
   // formDataToSend.append("collaborationRates", JSON.stringify(formData.collaborationRates));
 
    formDataToSend.append("pastCollaborations", JSON.stringify(formData.pastCollaborations));
  
    // Append files only if they are selected
    if (profileUrlOption === "system" && formData.profilePicture) {
      formDataToSend.append("profilePicture", document.querySelector('input[name="profilePicture"]').files[0]);
    } else {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }
  
    if (mediaKitOption === "system" && formData.mediaKit) {
      formDataToSend.append("mediaKit", document.querySelector('input[name="mediaKit"]').files[0]);
    } else {
      formDataToSend.append("mediaKit", formData.mediaKit);
    }
 
    try {
     
        const response = await axios.post("https://guest-posting-marketplace-web-backend.onrender.com/instagraminfluencers/addInstagraminfluencer", formDataToSend, {
       // const response = await axios.post("http://localhost:5000/instagraminfluencers/addInstagraminfluencer", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
     // setInfluencers((prev) => [...prev, response.data.instagramInfluencer]);
    // ((prevInfluencers) => [...prevInfluencers, newInfluencer]);
    setAddInfluencer((prev) => [...prev, response.data.instagramInfluencer]);
      console.log(formDataToSend)
      toast.success("Influencer added Successfully");
      handleReset();
    } catch (error) {
      toast.error(`Error adding influencer ${error}`);
      console.error("Error adding influencer", error);
    }
  };
  

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] instanceof File) {
          form.append(key, formData[key]);
        } else {
          form.append(key, formData[key]);
        }
      }
  
      const response = await axios.post("http://localhost:5000/instagraminfluencers/addInstagraminfluencer", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setInfluencers((prev) => [...prev, response.data.instagramInfluencer]);
      handleReset();
    } catch (error) {
      console.error("Error adding influencer", error);
    }
  };*/
  


  const handleReset=()=>{
    setFormData({
        username: "",
        fullName: "",
        profilePicture: "",
        bio: "",
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        engagementRate: 0,
        averageLikes: 0,
        averageComments: 0,
        category: "",
        location: "",
        language: "",
        verifiedStatus: false,
        collaborationRates: { post: 0, story: 0, reel: 0 },
        pastCollaborations: [],
        mediaKit: "",
      });
      setLocationQuery("")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Instagram Influencers</h1>
      <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="block">
            <span className="text-gray-700">Username</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Profile Picture URL</span>
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileUrlOption"
                  value="manual"
                  checked={profileUrlOption === "manual"}
                  onChange={() => setProfileUrlOption("manual")}
                  className="mr-2"
                />
                Manual
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileUrlOption"
                  value="system"
                  checked={profileUrlOption === "system"}
                  onChange={() => setProfileUrlOption("system")}
                  className="mr-2"
                />
                From System
              </label>
            </div>
            {profileUrlOption === "manual" ? (
              <input
                type="text"
                name="profilePicture"
                placeholder="Profile Picture URL"
                value={formData.profilePicture}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            ) : (
                <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            )}
          </label>
          <label className="block">
            <span className="text-gray-700">Bio</span>
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Followers Count</span>
            <input
              type="number"
              name="followersCount"
              placeholder="Followers Count"
              value={formData.followersCount}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Following Count</span>
            <input
              type="number"
              name="followingCount"
              placeholder="Following Count"
              value={formData.followingCount}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Posts Count</span>
            <input
              type="number"
              name="postsCount"
              placeholder="Posts Count"
              value={formData.postsCount}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Engagement Rate</span>
            <input
              type="number"
              name="engagementRate"
              placeholder="Engagement Rate"
              value={formData.engagementRate}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Average Likes</span>
            <input
              type="number"
              name="averageLikes"
              placeholder="Average Likes"
              value={formData.averageLikes}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Average Comments</span>
            <input
              type="number"
              name="averageComments"
              placeholder="Average Comments"
              value={formData.averageComments}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
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
          </label>
         {/* <label className="block">
            <span className="text-gray-700">Location</span>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>*/}
          <label className="block">
            <span className="text-gray-700">Location</span>
            <input
              type="text"
              name="location"
              placeholder="Search Location"
              value={locationQuery}
              onChange={handleLocationChange}
              className="p-2 border border-gray-300 rounded w-full"
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
          </label>
          <label className="block">
            <span className="text-gray-700">Language</span>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
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
          </label>
         
          <label className="flex items-center">
            <input
              type="checkbox"
              name="verifiedStatus"
              checked={formData.verifiedStatus}
              onChange={handleChange}
              className="mr-2"
            />
            Verified Status
          </label>
          <label className="block">
            <span className="text-gray-700">Collaboration Rates</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-gray-700">Post Rate</span>
                <input
                  type="number"
                  name="collaborationRates.post"
                  placeholder="Post Rate"
                  value={formData.collaborationRates.post}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Story Rate</span>
                <input
                  type="number"
                  name="collaborationRates.story"
                  placeholder="Story Rate"
                  value={formData.collaborationRates.story}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Reel Rate</span>
                <input
                  type="number"
                  name="collaborationRates.reel"
                  placeholder="Reel Rate"
                  value={formData.collaborationRates.reel}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </label>
            </div>
          </label>
          <label className="block">
            <span className="text-gray-700">Past Collaborations</span>
            <textarea
              name="pastCollaborations"
              placeholder="Past Collaborations"
              value={formData.pastCollaborations.join(", ")}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </label>
         
          <label className="block">
            <span className="text-gray-700">Media Kit</span>
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mediaKitOption"
                  value="manual"
                  checked={mediaKitOption === "manual"}
                  onChange={() => setMediaKitOption("manual")}
                  className="mr-2"
                />
                Manual
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mediaKitOption"
                  value="system"
                  checked={mediaKitOption === "system"}
                  onChange={() => setMediaKitOption("system")}
                  className="mr-2"
                />
                From System
              </label>
            </div>
            {mediaKitOption === "manual" ? (
              <input
                type="text"
                name="mediaKit"
                placeholder="Media Kit URL"
                value={formData.mediaKit}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            ) : (
              <input
              type="file"
              name="mediaKit"
              
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
            )}
          </label>
        </div>
        <div className="mt-4 flex justify-center md:justify-end space-x-4 mt-8">
        <button onClick={handleReset}
            type="button"
            className="p-2  bg-gray-600 text-white rounded hover:bg-gray-900 transition-all duration-300"
          >
            Reset
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-900 transition-all duration-300"
          >
            Add Influencer
          </button>
         
        </div>
      </form>
      <InstagramInfluencerTable addInfluencer={addInfluencer}/>
    </div>
  );
};

export default InstagramInfluencer;
