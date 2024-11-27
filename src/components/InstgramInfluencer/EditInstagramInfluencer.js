import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/userContext.js';
import { useTheme } from '../../context/ThemeProvider.js';
import LocationSelector from '../OtherComponents/LocationSelector.js';


const EditInstagramInfluencer = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate()
  const [profileUrlOption, setProfileUrlOption] = useState("manual");
  const [mediaKitOption, setMediaKitOption] = useState("manual");
  const [formData, setFormData] = useState({
    userId: userData?._id,
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

    location: {
      country: "",
      state: "",
      city: ""
    },
    language: "",
    verifiedStatus: false,
    collaborationRates: { post: 0, story: 0, reel: 0 },
    pastCollaborations: [],
    mediaKit: "",
  });

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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],  
      }));
    }
  };
  
  const handleFileChange1 = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0].name,
    }));
  };

  useEffect(() => {

    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {

      const response = await axios.get(`${localhosturl}/instagraminfluencers/getInstagraminfluencerById/${id}`);
console.log("In Edit get Data ",response.data.instagramInfluencer)
      setFormData(response.data.instagramInfluencer);
      // setOriginalUsers(response.data.instagramInfluencer);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  };

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

    return `You updated a Instagram Influencer with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Updated a new Instagram Influencer",
        section: "Instagram Influencer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "updated",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formdata: ", formData);
  
    const formDataToSend = new FormData();
  
    // Append individual form fields
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
    formDataToSend.append("language", formData.language);
    formDataToSend.append("verifiedStatus", formData.verifiedStatus);
  
    // Convert location object to JSON string and append
    if (formData.location) {
      formDataToSend.append("location", JSON.stringify(formData.location));
    }
  
    // Convert collaborationRates to JSON string and append
    if (formData?.collaborationRates) {
      formDataToSend.append("collaborationRates", JSON.stringify(formData.collaborationRates));
    }
  
    // Convert pastCollaborations to JSON string and append
    formDataToSend.append("pastCollaborations", JSON.stringify(formData.pastCollaborations));
  
    // Handle profile picture upload
    if (profileUrlOption === "system" && formData.profilePicture) {
      formDataToSend.append("profilePicture", document.querySelector('input[name="profilePicture"]').files[0]);
    } else if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }
  
    // Handle media kit upload
    if (mediaKitOption === "system" && formData.mediaKit) {
      formDataToSend.append("mediaKit", document.querySelector('input[name="mediaKit"]').files[0]);
    } else if (formData.mediaKit) {
      formDataToSend.append("mediaKit", formData.mediaKit);
    }
  
    try {
      // Make the PUT request to update the influencer data
      const response = await axios.put(
        `${localhosturl}/instagraminfluencers/updateInstagraminfluencer/${id}`, 
        formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",  // Ensure content type is multipart
          },
        }
      );
  
    
  
      toast.success("Influencer updated successfully!");
      pastactivitiesAdd(formDataToSend);
      navigate("/addInstagramInfluencer");
    
    } catch (error) {
      toast.error(`Error updating influencer: ${error.message}`);
      console.error("Error updating influencer", error);
    }
  };
  
  

  const handleSubmit2Actual = async (e) => {
    e.preventDefault();
  

    const uploadData = new FormData();
    console.log(formData.location)

    

    for (const [key, value] of Object.entries(formData)) {
      if (value && key !== "profilePicture" && key !== "mediaKit") {
        uploadData.append(key, value);
      }
    }
  
    if (formData.profilePicture) {
      uploadData.append("profilePicture", formData.profilePicture);
    }
  
    if (formData.mediaKit) {
      uploadData.append("mediaKit", formData.mediaKit);
    }
  
    try {
      await axios.put(`${localhosturl}/instagraminfluencers/updateInstagraminfluencer/${id}`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",  
        },
      });
  
      toast.success("Instagram Influencer updated successfully!");
      pastactivitiesAdd(formData);
      navigate("/addInstagramInfluencer");
    } catch (error) {
      toast.error(`Error updating Instagram Influencer: ${error.response.data.error}`);
      console.error("Error updating Instagram Influencer:", error);
    }
  };
  

  const handleSubmit1 = async (e) => {
    e.preventDefault()
    try {

console.log("Before adding edit ",formData)
      await axios.put(`${localhosturl}/instagraminfluencers/updateInstagraminfluencer/${id}`, { ...formData, userId: userData?._id, });


      toast.success("Instagram Influencer updated Successfully");
      pastactivitiesAdd(formData);
      navigate("/addInstagramInfluencer");
    } catch (error) {
      toast.error(`Error updating Instagram Influencer ${error.response.data.error}`);
      console.error("Error updating Instagram Influencer:", error);
    }
  }



  const handleLocationSelect = (location) => {
    console.log(location)
    setFormData((prev) => ({ ...prev, location }));
  };


  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-blue-600">Edit Instagram Influencers</h3>
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
              required
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
                value={formData?.profilePicture === undefined ? "https://cdn.pixabay.com/photo/2024/02/02/04/20/ai-generated-8547237_1280.png" : formData?.profilePicture}
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
              required
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
               <option value="" disabled>Select Category</option>
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
          <LocationSelector onSelectLocation={handleLocationSelect} />

          <label className="block">
            <span className="text-gray-700">Language</span>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
                <option value="" disabled>Select Language</option>
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

          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-900 transition-all duration-300"
          >
            Edit Influencer
          </button>

        </div>
      </form>

    </div>
  )
}

export default EditInstagramInfluencer