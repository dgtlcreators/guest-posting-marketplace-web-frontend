


import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { useTheme } from "../../context/ThemeProvider";

import { UserContext } from "../../context/userContext";


import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm";
import Bookmark from "../OtherComponents/Bookmark";
import Pagination from "../OtherComponents/Pagination";
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
      Location: user.location,
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
    // Call an API or directly update the state to toggle isBookmarked
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
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base">
              <tr>
                <th className="border px-4 py-2" >S.No </th>
                {/*<th className="border px-4 py-2" onClick={() => handleSort("username")}>Username {renderSortIcon("username")}</th>*/}
                <th className="border px-4 py-2" onClick={() => handleSort("fullName")}>Full Name {renderSortIcon("fullName")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("profilePicture")}>Profile Picture {renderSortIcon("profilePicture")}</th>
                {/*<th className="border px-4 py-2" onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>*/}
                <th className="border px-4 py-2" onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
                {/*<th className="border px-4 py-2" onClick={() => handleSort("followingCount")}>Following {renderSortIcon("followingCount")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("postsCount")}>Posts {renderSortIcon("postsCount")}</th>*/}
                <th className="border px-4 py-2" onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
                {/* <th className="border px-4 py-2" onClick={() => handleSort("averageLikes")}>Likes {renderSortIcon("averageLikes")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("averageComments")}>Comments {renderSortIcon("averageComments")}</th>*/}
                <th className="border px-4 py-2" onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("verifiedStatus")}>Verified Status {renderSortIcon("verifiedStatus")}</th>
                <th className="border px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
                {/*<th className="border px-4 py-2" onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("mediaKit")}>Media Kit {renderSortIcon("mediaKit")}</th>*/}
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
                  <tr key={influencer._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{index + 1}</td>
                    {/*<td className="border px-4 py-2">{influencer.username}</td>*/}
                    <td className="border px-4 py-2">{influencer.fullName}</td>
                    <td className="border py-2 px-4">
                      {/*console.log(influencer.profilePicture)
                  console.log(influencer?.username,influencer?.profilePicture?.startsWith("https")
                        ? influencer.profilePicture
                        
                        : `${localhosturl}${influencer.profilePicture}`)}
                       //: `https://guest-posting-marketplace-web-backend.onrender.com${influencer.profilePicture}`)*/}
                      <img
                        src={
                          influencer?.profilePicture?.startsWith("https")
                            ? influencer.profilePicture
                            : `${localhosturl}${influencer.profilePicture}`
                          //: `https://guest-posting-marketplace-web-backend.onrender.com${influencer.profilePicture}`
                        }
                        alt={influencer.username}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </td>
                    {/*<td className="border px-4 py-2">{influencer.bio}</td>*/}
                    <td className="border px-4 py-2">{influencer.followersCount}</td>
                    {/*<td className="border px-4 py-2">{influencer.followingCount}</td>*/}
                    {/*<td className="border px-4 py-2">{influencer.postsCount}</td>*/}
                    <td className="border px-4 py-2">{influencer.engagementRate}</td>
                    {/*<td className="border px-4 py-2">{influencer.averageLikes}</td>
                <td className="border px-4 py-2">{influencer.averageComments}</td>*/}
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
                    { /* <td className="border px-4 py-2">{influencer.pastCollaborations}</td>
               
                
                <td className="border px-4 py-2">
                <img
                    src={
                      influencer?.mediaKit?.startsWith('http')
                        ? influencer.mediaKit
                        //: `http://localhost:5000${influencer.mediaKit}`
                        : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.mediaKit}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />

                </td>*/}
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold"><ApplyForm section="InstagramInfluencer" publisher={influencer} /></td>
                    {/* <td  className="border py-3 px-2 md:px-6 text-center text-md font-semibold"> 
                  <button className="text-gray-600  focus:outline-none transition-transform transform hover:-translate-y-1"
                ><Bookmark  section="InstagramInfluencer" publisher={influencer}/></button>
                </td>*/}
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      <button disabled={userData.permissions.instagram.bookmark}
                      title={userData.permissions.instagram.bookmark
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                        onClick={() => handleToggleBookmark(influencer)}
                        className={`text-gray-600 focus:outline-none transition-transform transform hover:-translate-y-1 ${influencer.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                      >
                        <FaBookmark />
                        {/*influencer.isBookmarked ? ' Bookmarked' : ' Bookmark'*/}
                      </button>
                    </td>
                    <td className="border py-2 px-4">
                      <button  disabled={!userData.permissions.instagram.profile}
                      title={!userData.permissions.instagram.profile
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
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











/*import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BrandUserTable = ({ influencers }) => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(influencers.length / itemsPerPage);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = influencers.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewProfile = (influencer) => {
    navigate(`/influencerprofile/${influencer._id}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); 
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
     

      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2 text-gray-600">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md p-2"
          >
            {[5, 10, 15, 20, 25,30,35,40,45,50,55].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

      
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {currentItems.map((influencer) => (
          <motion.div
            key={influencer._id}
            className="bg-gradient-to-r from-teal-100 via-teal-200 to-teal-300 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <a href={influencer.profileLink} className="block relative">
              <img
                src={
                  influencer?.profilePicture?.startsWith("https")
                    ? influencer.profilePicture
                    : `https://guest-posting-marketplace-web-backend.onrender.com${influencer.profilePicture}`
                }
                alt={influencer.username}
                className="w-full h-56 lg:h-64 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent rounded-b-lg">
                <h2 className="text-lg lg:text-xl font-semibold text-white truncate">
                  {influencer.username}
                </h2>
                <p className="text-sm text-gray-300">{influencer.category}</p>
              </div>
            </a>
            <div className="p-4 flex flex-col justify-between bg-white border-t border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <b className="text-lg lg:text-xl text-green-600">{influencer.followersCount}</b>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="border-l border-gray-300 h-8"></div>
                <div className="text-center">
                  <b className="text-lg lg:text-xl text-pink-600">{influencer.followingCount}</b>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
              <button
                onClick={() => handleViewProfile(influencer)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-center"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-end items-center space-x-4">
      <motion.button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md transition-colors duration-300 ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Previous
      </motion.button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <motion.button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md transition-colors duration-300 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Next
      </motion.button>
    </div>
    </div>
  );
};

export default BrandUserTable;*/













/*import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BrandUserTable = ({influencers,setInfluencers}) => {
  const [originalUsers, setOriginalUsers] = useState([]);
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
                        : `http://localhost:5000${influencer.profilePicture}`
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
                        : `http://localhost:5000${influencer.mediaKit}`
                    }
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />

                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandUserTable;*/
