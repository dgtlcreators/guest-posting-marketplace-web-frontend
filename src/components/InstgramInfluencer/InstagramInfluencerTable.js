import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { useTheme } from "../../context/ThemeProvider.js";

import { UserContext } from "../../context/userContext.js";


import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm.js";
import Bookmark from "../OtherComponents/Bookmark.js";
import Pagination from "../OtherComponents/Pagination.js";
import { toast } from "react-toastify";
import axios from "axios";


const InstagramInfluencerTable = ({ influencers, setInfluencers }) => {
  const { isDarkTheme } = useTheme();
  const navigate = useNavigate();
  const { userData, localhosturl } = useContext(UserContext);

  const [originalUsers, setOriginalUsers] = useState(influencers);
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

  const handleViewProfile = (influencer) => {
    navigate(`/influencerprofile/${influencer._id}`);
  };

  const filteredUsers = influencers

  const exportDataToCSV = () => {
    const csvData = filteredUsers.map((user, index) => ({
      SNo: index + 1,
      FullName: user.fullName,
      ProfilePicture: user.profilePicture,
      FollowersCount: user.followersCount,
      EngagementRate: user.engagementRate,
      Category: user.category,
      Location: JSON.stringify(user.location),
      Language: user.language,
      VerifiedStatus: user.verifiedStatus,
      CollaborationRates: `Post: ${user.collaborationRates.post || 0}, Story: ${user.collaborationRates.story || 0}, Reel: ${user.collaborationRates.reel || 0}`,

    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "exported_data.csv");
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleToggleBookmark = async (influencer) => {
    
    const updatedBookmarkStatus = !influencer.isBookmarked;

    try {

      await axios.put(`${localhosturl}/instagraminfluencers/updateInstagraminfluencer/${influencer._id}`, {
        isBookmarked: updatedBookmarkStatus,
      });
      if (updatedBookmarkStatus) {
        toast.success("Added to Bookmarks!");
      } else {
        toast.success("Removed from Bookmarks!");
      }
      setInfluencers(prev =>
        prev.map(i => i._id === influencer._id ? { ...i, isBookmarked: updatedBookmarkStatus } : i)
      );
    } catch (error) {
      console.error('Error updating bookmark status', error);
    }
  };


  return (
    <div className="p-2 lg:p-4 max-w-7xl mx-auto">
      <div className="table-container">
        <div className="pb-3 flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
          <p className="text-center md:text-left transition duration-300 ease-in-out transform  hover:scale-105">
            <strong>Found: {filteredUsers.length}</strong>
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <>
              <label className="mr-2 whitespace-nowrap transition duration-300 ease-in-out transform  hover:scale-105">Items per page:</label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded-md py-2 px-2 transition duration-300 ease-in-out transform  hover:scale-105"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </>
            <button
              onClick={handleClearFilter}
              className="py-2 px-4 bg-blue-600 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105"
            >
              Clear Filter
            </button>
            <button
              onClick={exportDataToCSV}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Export Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-2  shadow-lg rounded-lg">

          <table className="min-w-full ">
            <thead className="text-base"
            >
              <tr>
                <th className="border px-4 py-2" >S.No </th>
            
                <th className="border px-4 py-2" onClick={() => handleSort("fullName")}>Full Name {renderSortIcon("fullName")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("profilePicture")}>Profile Picture {renderSortIcon("profilePicture")}</th>
               
                <th className="border px-4 py-2" onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              
                <th className="border px-4 py-2" onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
               
                <th className="border px-4 py-2" onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("verifiedStatus")}>Verified Status {renderSortIcon("verifiedStatus")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
                
                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>
                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Bookmark</th>
                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Profile</th>

              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="py-3 px-6 text-center text-lg font-semibold"
                  >
                    No Data Fetched
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((influencer, index) => (
                  <tr key={influencer._id}
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                
                    <td className="border px-4 py-2">{influencer.fullName}</td>
                    <td className="border py-2 px-4">
                     
                      <img
                        src={
                          influencer?.profilePicture?.startsWith("https")
                            ? influencer.profilePicture
                            : `${localhosturl}${influencer.profilePicture}`
                        
                        }
                        alt={influencer.username}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </td>
                   
                    <td className="border px-4 py-2">{influencer.followersCount}</td>
                 
                    <td className="border px-4 py-2">{influencer.engagementRate}</td>
                   
                    <td className="border px-4 py-2">{influencer.category}</td>
                    <td className="border px-4 py-2">{JSON.stringify(influencer.location)}</td>
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
                   
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold"><ApplyForm section="InstagramInfluencer" publisher={influencer} /></td>
                  
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      <button disabled={!userData.permissions.instagram.bookmark}
                      title={userData.permissions.instagram.bookmark
                        ? "You are not allowed to access this feature"
                        : undefined 
                      }
                        onClick={() => handleToggleBookmark(influencer)}
                        className={`text-gray-600 focus:outline-none transition-transform transform hover:-translate-y-1 ${influencer.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                      >
                        <FaBookmark />
                      
                      </button>
                    </td>
                    <td className="border py-2 px-4">
                      <button  disabled={!userData.permissions.instagram.profile}
                      title={!userData.permissions.instagram.profile
                        ? "You are not allowed to access this feature"
                        : undefined  
                      }
                        onClick={() => handleViewProfile(influencer)}
                        className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>

        </div>
        {filteredUsers.length > 0 && <Pagination
          totalItems={filteredUsers.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />}
      </div>
    </div>
  );
};

export default InstagramInfluencerTable;
