import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import NewYoutubeInfluencerTable from './NewYoutubeInfluencerTable.js';
import { UserContext } from '../../context/userContext.js';
import LocationSelector from '../OtherComponents/LocationSelector.js';

const NewYoutubeInfluencer = () => {

  const { userData, localhosturl } = useContext(UserContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    userId: userData?._id,
    username: "",
    fullname: "",
    profilePicture: "",
    bio: "",
    followersCount: 0,
    videosCount: 0,
    engagementRate: 0,
    averageViews: 0,
    category: "",
    //location: "",
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

  const [profileUrlOption, setProfileUrlOption] = useState("manual");
  const [mediaKitOption, setMediaKitOption] = useState("manual");



 
 

  const handleFileChange = (e) => {
    const { name, files } = e.target
   
    setFormData(prev => ({
      ...prev,
      [name]: files[0].name
    }))
  }
  

  const handleReset = () => {
    setFormData({
      username: "",
      fullname: "",
      verifiedStatus: false,
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
  }

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
      { key: 'Verified Status', value: formData.verifiedStatus ? 'Verified' : 'Unverified' },
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
    return `You created ${formattedElements}`;
  };
  const generateShortDescription = (formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');


    const shortElements = elements.slice(0, 2);

    return `You created a new YouTube Influencer with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Created a new YouTube Influencer",
        section: "YouTube Influencer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "create",
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
    const formDataToSend = new FormData();
  
    // Append fields
    Object.keys(formData).forEach(field => {
      if (typeof formData[field] === 'object') {
        formDataToSend.append(field, JSON.stringify(formData[field]));
      } else {
        formDataToSend.append(field, formData[field]);
      }
    });
  
    // Handle file uploads
    if (profileUrlOption === "system" && formData.profilePicture) {
      formDataToSend.append("profilePicture", document.querySelector('input[name="profilePicture"]').files[0]);
    }
  
    if (mediaKitOption === "system" && formData.mediaKit) {
      formDataToSend.append("mediaKit", document.querySelector('input[name="mediaKit"]').files[0]);
    }
  
    try {
      await axios.post(`${localhosturl}/youtubeinfluencers/addYoutubeInfluencer`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Influencer updated Successfully");
     // navigate("/addYoutubeInfluencer");
    } catch (error) {
      console.error("Error updating influencer", error);
      toast.error(`Error updating influencer: ${error.message}`);
    }
  };
  
  



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith("collaborationRates")) {
      const key = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        collaborationRates: {
          ...prev.collaborationRates,
          [key]: type === "number" ? parseFloat(value) : value
        }
      }))

    } else if (name.startsWith("audienceDemographics")) {
      const key = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        audienceDemographics: {
          ...prev.audienceDemographics,
          [key]: value.split(',').map((item) => item.trim()),
        }
      }))
    }
    else if (name.startsWith("pastCollaborations")) {
      setFormData(prev => ({
        ...prev,
        pastCollaborations: value.split(",").map(item => item.trim())
      }))
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name === "verified" ? "verifiedStatus" : name]: 
        type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }))
    }
  }

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold   p-3'//text-white bg-blue-700
      >Youtube Influencers</h2>
      <form onSubmit={handleSubmit} className='mb-4 p-4 bg-gray-100 rounded-lg shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='block'>
            <label className='text-gray-700'>FUll Name</label>
            <input type='text' name='username' placeholder='Name'
              value={formData.username} onChange={handleChange}
              className='p-2 border border-gray-300 rounded w-full' required />
          </div>
          <div className='block'>
            <label className='text-gray-700'>User Name</label>
            <input type='text' name='fullname' placeholder='Last Name'
              value={formData.fullname} onChange={handleChange}
              className='p-2 border border-gray-300 rounded w-full' required />
          </div>
          
          <div className='block'>
            <label className='text-gray-700'>profile Picture Url</label>
            <div className='flex items-center space-x-2'>
              <label className='flex items-center'>
                <input type='radio' name='profileUrlOption' value="manual" checked={profileUrlOption === "manual"}
                  onChange={() => setProfileUrlOption("manual")} className='mr-2' />
                Manual </label>
              <label className='flex items-center'>
                <input type='radio' name='profileUrlOption' value="system" checked={profileUrlOption === "system"}
                  onChange={() => setProfileUrlOption("system")} className='mr-2' />
                From System </label>
            </div>
            {profileUrlOption === "manual" ? (
              <input type='text' name='profilePicture' placeholder='Profile Picture URL' value={formData.profilePicture} onChange={handleChange}
                className='p-2 border border-gray-300 rounded w-full' />
            ) : (
              <input
                type="file"
                name='profilePicture' placeholder='Profile Picture URL'

                onChange={handleFileChange}
                className="p-2 border border-gray-300 rounded w-full"
              />

            )}
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="verified"
              checked={formData.verifiedStatus}
              onChange={handleChange}
              className="mr-2"
            />
            Verified
          </label>
          <div className='block'>
            <label className='text-gray-700'>Bio</label>
            <textarea name='bio' placeholder='Bio' value={formData.bio} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' required />
          </div>
          <div className='block'>
            <label className='text-gray-700'>Followers Count</label>
            <input type='number' name='followersCount' placeholder='Followers Count' value={formData.followersCount} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </div>
          <div className='block'>
            <label className='text-gray-700'>videos Count</label>
            <input type='number' name='videosCount' placeholder='Videos Count' value={formData.videosCount} onChange={handleChange} className='p-2 border border-gray-700 rounded w-full' />
          </div>
          <div className='block'>
            <label className='text-gray-700'>Engagement Rate</label>
            <input type='number' name='engagementRate' placeholder='Engagement Rate' value={formData.engagementRate} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </div>
          <div className='block'>
            <label className='text-gray-700'>Average Views</label>
            <input type='number' name='averageViews' placeholder='Average Views' value={formData.averageViews} onChange={handleChange} className='p-2 border border-gray-700 rounded w-full' />
          </div>
          <div className='block'>
            <label className='text-gray-700'>Category</label>
            <select name='category' value={formData.category} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full'>
            <option value="" disabled>Select Category</option>
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
          { /*<div className='block'>
            <label className='text-gray-700'>Location</label>
            <input type='text' name='location' placeholder='Search Location'  value={locationQuery}
              onChange={handleLocationChange} 
            className='p-2 border border-gray-300 rounded w-full' required/>
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
          <div className='block'>
            <label className='text-gray-700'>Language</label>
            <select name='language' value={formData.language} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full'>
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
              <option value="Other">Other</option>
            </select>
          </div>
          <div className='block'>
            <label className='text-gray-700'>Collaboration Rates</label>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='block'>
                <label className='text-gray-700'>Sponsored Videos</label>
                <input type='number' name='collaborationRates.sponsoredVideos' placeholder='Sponsored Videos' value={formData.collaborationRates.sponsoredVideos} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </div>
              <div className='block'>
                <label className='text-gray-700'>Product Reviews</label>
                <input type='number' name='collaborationRates.productReviews' placeholder='Product Reviews' value={formData.collaborationRates.productReviews} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </div>
              <div className='block'>
                <label className='text-gray-700'>Shoutouts</label>
                <input type='number' name='collaborationRates.shoutouts' placeholder='Shoutouts' value={formData.collaborationRates.shoutouts} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </div>
            </div>
          </div>
          <div className='block'>
            <label className='text-gray-700'>Past Collaborations</label>
            <textarea name='pastCollaborations' placeholder='Past Collaborations' value={formData.pastCollaborations} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </div>
          {/* <div className='block grid-col-1'>
          <label className='text-gray-700'>Audience Demographics</label>
          <div className='grid grid-col-1 md:grid-cols-1 gap-4'>*/}
          <div className='block'>
            <label className='text-gray-700'>Audience Demographics (Age)</label>
            <textarea name='audienceDemographics.age' placeholder='Age' value={formData.audienceDemographics.age} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </div>
          <div className='block'>
            <label className='text-gray-700'>Audience Demographics (Gender)</label>
            <textarea name='audienceDemographics.gender' placeholder='Gender' value={formData.audienceDemographics.gender} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </div>
          <div className='block'>
            <label className='text-gray-700'>Audience Demographics (Geographic Distribution)</label>
            <textarea name='audienceDemographics.geographicDistribution' placeholder='Geographic Distribution' value={formData.audienceDemographics.geographicDistribution} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </div>
          {/*</div>
          </div>*/}

          <div className="block">
            <label className="text-gray-700">Media Kit</label>
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
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            type="reset"
            onClick={handleReset}
            className="py-2 px-4 bg-gray-900 text-white rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:animate-resetColorChange"
          >
            Reset
          </button>
          <button
            disabled={!userData.permissions.youtube.add}
            title={!userData.permissions.youtube.add
              ? "You are not allowed to access this feature"
              : undefined  // : ""
            }
            type="submit"
            className="py-2 px-4 bg-blue-900 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 hover:animate-submitColorChange"
          >
            Add Influencer
          </button>
        </div>
      </form>
      <NewYoutubeInfluencerTable key={refreshKey} />
    </div>
  )
}

export default NewYoutubeInfluencer