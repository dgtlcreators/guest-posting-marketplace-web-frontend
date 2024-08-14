import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';


const NewYoutubeInfluencerTable = ({addYotubeInfluencer,setAddYotubeInfluencer}) => {
  const { isDarkTheme } = useTheme();
  const [influencers, setInfluencers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);

  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  /*const handleSort = (field) => {
    console.log("fleid",field)
    let direction = "asc";
    if (sortedField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortedField(field);
    setSortDirection(direction);
    const sortedUsers = [...influencers].sort((a, b) => {
     console.log("a,b",a[field] , b[field])
      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setInfluencers(sortedUsers);
  };*/

  /*const handleSort = (field) => {
    
    let direction = "asc";
    if (sortedField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortedField(field);
    setSortDirection(direction);
  
    const sortedUsers = [...influencers].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      console.log("Comparing:", a[field], b[field]);
  
      // Handle nested object fields (e.g., 'collaborationRates.sponsoredVideos')
      if (typeof aValue === 'object' && aValue !== null) {
        aValue = JSON.stringify(aValue);
      }
      if (typeof bValue === 'object' && bValue !== null) {
        bValue = JSON.stringify(bValue);
      }
  
      // Handle sorting of arrays (e.g., 'pastCollaborations')
      if (Array.isArray(aValue)) {
        aValue = aValue.join(", ");
      }
      if (Array.isArray(bValue)) {
        bValue = bValue.join(", ");
      }
  
      // Case-insensitive string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
  
      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  
    setInfluencers(sortedUsers);
  };*/
  
  const handleSort = (field) => {
    let direction = "asc";
    if (sortedField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortedField(field);
    setSortDirection(direction);
  
    const resolveField = (obj, path) => path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : '', obj);
  
    const sortedUsers = [...influencers].sort((a, b) => {
      let aValue = resolveField(a, field);
      let bValue = resolveField(b, field);
      //console.log("Comparing:", aValue, bValue);
  
      if (typeof aValue === 'object' && aValue !== null) {
        aValue = JSON.stringify(aValue);
      }
      if (typeof bValue === 'object' && bValue !== null) {
        bValue = JSON.stringify(bValue);
      }
  
      if (Array.isArray(aValue)) {
        aValue = aValue.join(", ");
      }
      if (Array.isArray(bValue)) {
        bValue = bValue.join(", ");
      }
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
  
      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  
    setInfluencers(sortedUsers);
  };
  

  const renderSortIcon = (field) =>{
    if(sortedField===field){
      return sortDirection==="asc"?<FaSortUp/>:<FaSortDown/>
    }
    return <FaSort/>
  }


  useEffect(()=>{
    const fetchInfluencer=async()=>{
      try {
        const response = await axios.get("https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/getAllYoutubeInfluencer")
        // const response = await axios.get("http://localhost:5000/youtubeinfluencers/getAllYoutubeInfluencer");
          
        setInfluencers(response.data.data)
        setOriginalUsers(response.data.data)
      } catch (error) {
        console.error("Error fetching influencers", error);
      }
    }

    fetchInfluencer()
  },[])

  const deleteInstagramInfluencer=async(id)=>{
    try {
      await axios.delete(
        
       // `http://localhost:5000/youtubeinfluencers/deleteYoutubeInfluencer/${id}`
        `https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/deleteYoutubeInfluencer/${id}`
      );
      toast.success("Instagram Influencer Deleted Successfully");
      setInfluencers(influencers.filter((influencer) => influencer._id !== id));
    } catch (error) {
      toast.error("Error deleting Instagram Influencer");
      console.error("Error deleting Instagram Influencer:", error);
    }
  }

const handleClearFilter=()=>{
  setInfluencers(originalUsers)
  setSortDirection("asc")
  setSortedField(null)
}

  return (
    <div className='table-container'>
      <div className='mb-4'>
        <button onClick={handleClearFilter} className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'>Clear Filter</button>
      </div>
      <div className='overflow-x-auto bg-white p-4 rounded-lg shadow-md'>
        <table className='min-w-full bg-white text-sm'>
          <thead>
            <tr className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base'>
              <th className='px-4 py-2'>S.No </th>
              <th className='px-4 py-2'  onClick={() => handleSort("username")}>Username {renderSortIcon("username")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("fullname")}>Full Name {renderSortIcon("fullname")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("profilePicture")}>Profile Picture {renderSortIcon("profilePicture")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("videosCount")}>videos Count {renderSortIcon("videosCount")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("averageViews")}>Average Views {renderSortIcon("averageViews")}</th>
              <th className='px-4 py-2'   onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("audienceDemographics")}>Audience Demographics {renderSortIcon("audienceDemographics")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("mediaKit")}>mediaKit  {renderSortIcon("mediaKit")}</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
             
            </tr>
          </thead>
          <tbody>
            {influencers.map((influencer,index)=>(
              <tr key={influencer._id} className='hover:bg-gray-100 transition-colors'>
                <td className='border px-4 py-2'>{index+1}</td>
                <td className='border px-4 py-2'>{influencer.username}</td>
                <td className='border px-4 py-2'>{influencer.fullname}</td>
                <td className='border px-4 py-2'>
                <img
                    src={
                      influencer?.profilePicture?.startsWith('https')
                        ? influencer.profilePicture
                        : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.profilePicture}`
                      // : `http://localhost:5000${influencer.profilePicture}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className='border px-4 py-2'>{influencer.bio}</td>
                <td className='border px-4 py-2'>{influencer.followersCount}</td>
                <td className='border px-4 py-2'>{influencer.videosCount}</td>
                <td className='border px-4 py-2'>{influencer.engagementRate}</td>
                <td className='border px-4 py-2'>{influencer.averageViews}</td>
                <td className='border px-4 py-2'>{influencer.category}</td>
                <td className='border px-4 py-2'>{influencer.location}</td>
                <td className='border px-4 py-2'>{influencer.language}</td>
                <td className='border px-4 py-2'>{influencer.collaborationRates?(
                  <div>
                    <div>Sponsored Videos: {influencer.collaborationRates.sponsoredVideos}</div>
                    <div>Product Reviews: {influencer.collaborationRates.productReviews}</div>
                    <div>Shoutouts: {influencer.collaborationRates.shoutouts}</div>
                  </div>
                ):"N/A"}</td>
                <td className='border px-4 py-2'>{influencer.pastCollaborations.join(",")}</td>
                <td className='border px-4 py-2'>{influencer.audienceDemographics?
                <div>
                  <div>Age: {influencer.audienceDemographics.age.join(",")}</div>
                  <div>Gender: {influencer.audienceDemographics.gender.join(",")}</div>
                  <div>Geographic Distribution: {influencer.audienceDemographics.geographicDistribution.join(",")}</div>
                </div>:"N/A"}</td>
                <td className='border px-4 py-2'>
                <img
                    src={
                      influencer?.mediaKit?.startsWith('http')
                        ? influencer.mediaKit
                        : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.mediaKit}`
                      //  : `http://localhost:5000${influencer.mediaKit}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />

                </td>
                <td className='py-3 px-4'>
                <Link
                    to={`/edityoutubeInfluencer/${influencer._id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  >
                    EDIT
                  </Link>
                <button
                    onClick={() => deleteInstagramInfluencer(influencer._id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded my-2"
                  >
                    <i className="fa-solid fa-trash"></i> DELETE
                  </button>
                </td>
                
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default NewYoutubeInfluencerTable