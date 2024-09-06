
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';

const NewInstagramInfluencerTable = ({addInfluencer}) => {
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext); 
  const userId = userData?._id;
  const [influencers, setInfluencers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        
       const response = await axios.get(`${localhosturl}/instagraminfluencers/getAllInstagraminfluencer`);
        
        setInfluencers(response.data.instagramInfluencer);
        setOriginalUsers(response.data.instagramInfluencer);
        //setInfluencers(addInfluencer)
      } catch (error) {
        console.error("Error fetching influencers", error);
      }
    };
  
    fetchInfluencers();
  }, []);

  
 // console.log(originalUsers, influencers);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");


  const handleSort = (field) => {
    let direction = "asc";
    if (sortedField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortedField(field);
    setSortDirection(direction);
    const sortedUsers = [...influencers].sort((a, b) => {
     
      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setInfluencers(sortedUsers);
  };

  const renderSortIcon = (field) => {
    if (sortedField === field) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleClearFilter = () => {
  
    setSortedField(null); 
    setSortDirection("asc"); 
    setInfluencers(originalUsers)
  };

  const createDescriptionElements = (formData, users) => {
    const elements = [
      { key: 'Username', value: formData.username },
      { key: 'Full Name', value: formData.fullname },
      { key: 'Profile Picture', value: formData.profilePicture },
      { key: 'Bio', value: formData.bio },
      { key: 'Followers Count', value: formData.followersCount },
      { key: 'Videos Count', value: formData.videosCount },
      { key: 'Engagement Rate', value: `${formData.engagementRate}%` },
      { key: 'Average Views', value: formData.averageViews },
      { key: 'Category', value: formData.category },
      { key: 'Location', value: formData.location },
      { key: 'Language', value: formData.language },
      { key: 'Collaboration Rates (Sponsored Videos)', value: formData.collaborationRates.sponsoredVideos },
      { key: 'Collaboration Rates (Product Reviews)', value: formData.collaborationRates.productReviews },
      { key: 'Collaboration Rates (Shoutouts)', value: formData.collaborationRates.shoutouts },
      { key: 'Past Collaborations', value: formData.pastCollaborations.join(', ') },
      { key: 'Audience Demographics (Age)', value: formData.audienceDemographics.age.join(', ') },
      { key: 'Audience Demographics (Gender)', value: formData.audienceDemographics.gender.join(', ') },
      { key: 'Audience Demographics (Geographic Distribution)', value: formData.audienceDemographics.geographicDistribution.join(', ') },
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

  return `You created a Instagram Influencer with ${shortElements.join(' and ')} successfully.`;
};
const pastactivitiesAdd=async(users)=>{
  const formData={}
  const description = createDescriptionElements(formData, users);
  const shortDescription = generateShortDescription(formData, users);

 try {
  const activityData={
    userId:userData?._id,
    action:"Deleted a Instagram Influencer",
    section:"Instagram Influencer",
    role:userData?.role,
    timestamp:new Date(),
    details:{
      type:"delete",
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

  const deleteInstagramInfluencer=async(id)=>{
    try {
      await axios.delete(
        
        `${localhosturl}/instagraminfluencers/deleteInstagraminfluencer/${id}`
       
      );
      const user = influencers.find((user) => user._id === id);
     
      await pastactivitiesAdd(user);
      toast.success("Instagram Influencer Deleted Successfully");
      setInfluencers(influencers.filter((influencer) => influencer._id !== id));
    } catch (error) {
      toast.error("Error deleting Instagram Influencer");
      console.error("Error deleting Instagram Influencer:", error);
    }
  }

  
  return (
    <div className="table-container">
     <div className="mb-4">
        <button
          onClick={handleClearFilter}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Clear Filter
        </button></div>
      <div className="overflow-x-auto  p-4 rounded-lg shadow-md">
        <table className="min-w-full  text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base">
              <th className="border px-4 py-2" >S.No </th>
              <th className="border px-4 py-2" onClick={() => handleSort("username")}>Username {renderSortIcon("username")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("fullName")}>Full Name {renderSortIcon("fullName")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("profilePicture")}>Profile Picture {renderSortIcon("profilePicture")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("followingCount")}>Following {renderSortIcon("followingCount")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("postsCount")}>Posts {renderSortIcon("postsCount")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("averageLikes")}>Likes {renderSortIcon("averageLikes")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("averageComments")}>Comments {renderSortIcon("averageComments")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("verifiedStatus")}>Verified Status {renderSortIcon("verifiedStatus")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("mediaKit")}>Media Kit {renderSortIcon("mediaKit")}</th>
              <th className="border py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {influencers.map((influencer, index) => (
              <tr key={influencer._id} className="hover:bg-gray-100 transition-colors">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{influencer.username}</td>
                <td className="border px-4 py-2">{influencer.fullName}</td>
                <td className="border px-4 py-2">
                <img
                    src={
                      influencer?.profilePicture?.startsWith('https')
                        ? influencer.profilePicture
                       // : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.profilePicture}`
                        : `${localhosturl}${influencer.profilePicture}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />

                </td>
                <td className="border px-4 py-2">{influencer.bio}</td>
                <td className="border px-4 py-2">{influencer.followersCount}</td>
                <td className="border px-4 py-2">{influencer.followingCount}</td>
                <td className="border px-4 py-2">{influencer.postsCount}</td>
                <td className="border px-4 py-2">{influencer.engagementRate}</td>
                <td className="border px-4 py-2">{influencer.averageLikes}</td>
                <td className="border px-4 py-2">{influencer.averageComments}</td>
                <td className="border px-4 py-2">{influencer.category}</td>
                <td className="border px-4 py-2">{influencer.location}</td>
                <td className="border px-4 py-2">{influencer.language}</td>
                <td className="border px-4 py-2">{influencer.verifiedStatus ? 'Verified' : 'Not Verified'}</td>
                
                <td className="border px-4 py-2 text-center">
                  {influencer.collaborationRates ? (
                    <div>
                      <div>Post: {influencer.collaborationRates.post}</div>
                      <div>Story: {influencer.collaborationRates.story}</div>
                      <div>Reel: {influencer.collaborationRates.reel}</div>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="border px-4 py-2">{influencer.pastCollaborations}</td>
                <td className="border px-4 py-2">
                <img
                    src={
                      influencer?.mediaKit?.startsWith('http')
                        ? influencer.mediaKit
                       // : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.mediaKit}`
                        : `${localhosturl}${influencer.mediaKit}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />

                </td>
                <td className="border py-3 px-4">
                <Link
                    to={`/editInstagramInfluencer/${influencer._id}`}
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
  );
};

export default NewInstagramInfluencerTable;
