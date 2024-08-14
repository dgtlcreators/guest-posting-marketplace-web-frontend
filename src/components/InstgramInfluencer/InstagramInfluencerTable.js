
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider';

const InstagramInfluencerTable = ({addInfluencer}) => {
  const { isDarkTheme } = useTheme();
  const [influencers, setInfluencers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
         const response = await axios.get("https://guest-posting-marketplace-web-backend.onrender.com/instagraminfluencers/getAllInstagraminfluencer")
      // const response = await axios.get("http://localhost:5000/instagraminfluencers/getAllInstagraminfluencer");
        
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

  const deleteInstagramInfluencer=async(id)=>{
    try {
      await axios.delete(
        
        //`http://localhost:5000/instagraminfluencers/deleteInstagraminfluencer/${id}`
        `https://guest-posting-marketplace-web-backend.onrender.com/instagraminfluencers/deleteInstagraminfluencer/${id}`
      );
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
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base">
              <th className="px-4 py-2" >S.No </th>
              <th className="px-4 py-2" onClick={() => handleSort("username")}>Username {renderSortIcon("username")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("fullName")}>Full Name {renderSortIcon("fullName")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("profilePicture")}>Profile Picture {renderSortIcon("profilePicture")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("followingCount")}>Following {renderSortIcon("followingCount")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("postsCount")}>Posts {renderSortIcon("postsCount")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("averageLikes")}>Likes {renderSortIcon("averageLikes")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("averageComments")}>Comments {renderSortIcon("averageComments")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("verifiedStatus")}>Verified Status {renderSortIcon("verifiedStatus")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("mediaKit")}>Media Kit {renderSortIcon("mediaKit")}</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
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
                        : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.profilePicture}`
                        /*: `http://localhost:5000${influencer.profilePicture}`*/
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
                        : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.mediaKit}`
                      //  : `http://localhost:5000${influencer.mediaKit}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />

                </td>
                <td className="py-3 px-4">
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

export default InstagramInfluencerTable;
