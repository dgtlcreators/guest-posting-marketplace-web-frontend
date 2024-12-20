import React, { useContext, useEffect, useState } from 'react'
import { useCallback} from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserContext } from '../../context/userContext.js';
import { useNavigate, useParams } from 'react-router-dom';
import LocationSelector from '../OtherComponents/LocationSelector.js';

const EditYoutubeInfluencer = () => {

  const { userData, localhosturl } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    profilePicture: "",
    verifiedStatus:false,
    bio: "",
    followersCount: 0,
    videosCount: 0,
    engagementRate: 0,
    averageViews: 0,
    category: "",
   // location: "",
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
    userId: userData?._id,
  })

  const fetchInfluencers = useCallback(async () => {
    try {
      const response = await axios.get(`${localhosturl}/youtubeinfluencers/getYoutubeInfluencer/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error("Error fetching influencers", error);
    }
  }, [id]);  // Dependencies are listed here
  
  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);
 
  const [profileUrlOption, setProfileUrlOption] = useState("manual");
  const [mediaKitOption, setMediaKitOption] = useState("manual");
  const [addYotubeInfluencer, setAddYotubeInfluencer] = useState([]);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);


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
      profilePicture: "",
      bio: "",
      followersCount: 0,
      videosCount: 0,
      engagementRate: 0,
      averageViews: 0,
      category: "",
     // location: "",
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
  //  setLocationQuery("")
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
    return `You updated ${formattedElements}`;
  };
  const generateShortDescription = (formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');


    const shortElements = elements.slice(0, 2);

    return `You updated a YouTube Influencer with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Updated a new YouTube Influencer",
        section: "YouTube Influencer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "update",
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
      await axios.put(`${localhosturl}/youtubeinfluencers/updateYoutubeInfluencer/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Influencer updated Successfully");
      navigate("/addYoutubeInfluencer");
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
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }))
    }
  }



  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };


  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold text-white bg-blue-700  p-3'>Update Youtube Influencers</h2>
      <form onSubmit={handleSubmit} className='mb-4 p-4 bg-gray-100 rounded-lg shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <label className='block'>
            <span className='text-gray-700'>Username</span>
            <input type='text' name='username' placeholder='Username'
              value={formData.username} onChange={handleChange}
              className='p-2 border border-gray-300 rounded w-full' required />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Full Name</span>
            <input type='text' name='fullname' placeholder='Full Name'
              value={formData.fullname} onChange={handleChange}
              className='p-2 border border-gray-300 rounded w-full' required />
          </label>

          {/* <label className='block'>
            <span className='text-gray-700'>profile Picture Url</span>
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
              <input type='file' name='profilePicture' placeholder='Profile Picture URL'// value={formData.profilePicture} 
              onChange={handleFileChange}
                className='p-2 border border-gray-300 rounded w-full' />
            )}
          </label> */}

<label className="block">
  <span className="text-gray-700">Profile Picture URL</span>
  <div className="mt-4">
    <input
      type="text"
      name="profilePicture"
      placeholder="Profile Picture URL"
      value={formData.profilePicture}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded w-full"
    />
    {formData.profilePicture && (
      <div className="mt-2">
        <img
          src={formData.profilePicture}
          alt="Profile Preview"
          className="w-20 h-20 object-cover border rounded"
        />
      </div>
    )}
  </div>
</label>



          <label className="flex items-center">
            <input
              type="checkbox"
              name="verifiedStatus"
              checked={formData.verifiedStatus}
              onChange={handleChange}
              className="mr-2"
            />
            Verified
          </label>
          <label className='block'>
            <span className='text-gray-700'>Bio</span>
            <textarea name='bio' placeholder='Bio' value={formData.bio} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' required />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Followers Count</span>
            <input type='number' name='followersCount' placeholder='Followers Count' value={formData.followersCount} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </label>
          <label className='block'>
            <span className='text-gray-700'>videos Count</span>
            <input type='number' name='videosCount' placeholder='Videos Count' value={formData.videosCount} onChange={handleChange} className='p-2 border border-gray-700 rounded w-full' />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Engagement Rate</span>
            <input type='number' name='engagementRate' placeholder='Engagement Rate' value={formData.engagementRate} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Average Views</span>
            <input type='number' name='averageViews' placeholder='Average Views' value={formData.averageViews} onChange={handleChange} className='p-2 border border-gray-700 rounded w-full' />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Category</span>
            <select name='category' value={formData.category} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full'>
            <option value="" disabled>Select Language</option>
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
          </label>
            <LocationSelector onSelectLocation={handleLocationSelect} />
      
          <label className='block'>
            <span className='text-gray-700'>Language</span>
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
          </label>
          <label className='block'>
            <span className='text-gray-700'>Collaboration Rates</span>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <label className='block'>
                <span className='text-gray-700'>Sponsored Videos</span>
                <input type='number' name='collaborationRates.sponsoredVideos' placeholder='Sponsored Videos' value={formData.collaborationRates.sponsoredVideos} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </label>
              <label className='block'>
                <span className='text-gray-700'>Product Reviews</span>
                <input type='number' name='collaborationRates.productReviews' placeholder='Product Reviews' value={formData.collaborationRates.productReviews} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </label>
              <label className='block'>
                <span className='text-gray-700'>Shoutouts</span>
                <input type='number' name='collaborationRates.shoutouts' placeholder='Shoutouts' value={formData.collaborationRates.shoutouts} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </label>
            </div>
          </label>
          <label className='block'>
            <span className='text-gray-700'>Past Collaborations</span>
            <textarea name='pastCollaborations' placeholder='Past Collaborations' value={formData.pastCollaborations} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
          </label>
          <label className='block grid-col-1'>
            <span className='text-gray-700'>Audience Demographics</span>
            <div className='grid grid-col-1 md:grid-cols-1 gap-4'>
              <label className='block'>
                <span className='text-gray-700'>Age</span>
                <textarea name='audienceDemographics.age' placeholder='Age' value={formData.audienceDemographics.age} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </label>
              <label className='block'>
                <span className='text-gray-700'>Gender</span>
                <textarea name='audienceDemographics.gender' placeholder='Gender' value={formData.audienceDemographics.gender} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </label>
              <label className='block'>
                <span className='text-gray-700'>Geographic Distribution</span>
                <textarea name='audienceDemographics.geographicDistribution' placeholder='Geographic Distribution' value={formData.audienceDemographics.geographicDistribution} onChange={handleChange} className='p-2 border border-gray-300 rounded w-full' />
              </label>
            </div>
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
        <div className='mt-4 flex justify-center md:justify-end space-x-4 '>

          <button type='submit' className='p-2 bg-blue-600 text-white rounded hover:bg-blue-900 transition-all duration-300'>
            Update Influencer
          </button>
        </div>
      </form>

    </div>
  )
}

export default EditYoutubeInfluencer
