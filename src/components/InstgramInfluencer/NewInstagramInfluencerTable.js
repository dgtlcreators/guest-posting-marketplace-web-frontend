
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';


import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm.js";
import ShowApplyForm from "../OtherComponents/ShowApplyForm.js";
import Bookmark from "../OtherComponents/Bookmark.js";
import Pagination from "../OtherComponents/Pagination.js";



const NewInstagramInfluencerTable = ({ addInfluencer }) => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const [influencers, setInfluencers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {

        const response = await axios.get(`${localhosturl}/instagraminfluencers/getAllInstagraminfluencer`);

        setInfluencers(response.data.instagramInfluencer);
        setOriginalUsers(response.data.instagramInfluencer);

      } catch (error) {
        console.error("Error fetching influencers", error);
      }
    };

    fetchInfluencers();
  }, []);



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
      { key: 'Username', value: formData?.username },
      { key: 'Full Name', value: formData?.fullname },
      { key: 'Profile Picture', value: formData?.profilePicture },
      { key: 'Bio', value: formData?.bio },
      { key: 'Followers Count', value: formData?.followersCount },
      { key: 'Videos Count', value: formData?.videosCount },
      { key: 'Engagement Rate', value: `${formData?.engagementRate}%` },
      { key: 'Average Views', value: formData?.averageViews },
      { key: 'Category', value: formData?.category },
      { key: 'Location', value: JSON.stringify(formData?.location) },
      { key: 'Language', value: formData?.language },
      { key: 'Collaboration Rates (Sponsored Videos)', value: formData?.collaborationRates?.sponsoredVideos },
      { key: 'Collaboration Rates (Product Reviews)', value: formData?.collaborationRates?.productReviews },
      { key: 'Collaboration Rates (Shoutouts)', value: formData?.collaborationRates?.shoutouts },
      { key: 'Past Collaborations', value: Array.isArray(formData?.pastCollaborations) ? formData?.pastCollaborations.join(', ') : 'N/A' },
      { key: 'Audience Demographics (Age)', value: Array.isArray(formData?.audienceDemographics?.age) ? formData?.audienceDemographics?.age.join(', ') : 'N/A' },
      { key: 'Audience Demographics (Gender)', value: Array.isArray(formData?.audienceDemographics?.gender) ? formData?.audienceDemographics?.gender.join(', ') : 'N/A' },
      { key: 'Audience Demographics (Geographic Distribution)', value: Array.isArray(formData?.audienceDemographics?.geographicDistribution) ? formData?.audienceDemographics?.geographicDistribution.join(', ') : 'N/A' },
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
  const pastactivitiesAdd = async (users) => {
    const formData = {}
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Deleted a Instagram Influencer",
        section: "Instagram Influencer",
        role: userData?.role,
        timestamp: new Date(),
        details: {
          type: "delete",
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
  const deleteInstagramInfluencer = async (id) => {
    try {

      await axios.delete(`${localhosturl}/instagraminfluencers/deleteInstagraminfluencer/${id}`);


      const user = influencers.find((influencer) => influencer._id === id);


      if (user) {
        
        await pastactivitiesAdd(user);
 
        toast.success("Instagram Influencer Deleted Successfully");
  
        setInfluencers(influencers.filter((influencer) => influencer._id !== id));

      } else {
        toast.error("Instagram Influencer not found in the local state");
      }
    } catch (error) {
      toast.error("Error deleting Instagram Influencer");
      console.error("Error deleting Instagram Influencer:", error);
    }
  };

 

  const handleViewProfile = (influencer) => {
    navigate(`/influencerprofile/${influencer._id}`);
  };

  const filteredUsers = influencers

  const exportDataToCSV = () => {
    const csvData = filteredUsers.map((user, index) => ({
      SNo: index + 1,
      Username: user.username,
      FullName: user.fullName,
      ProfilePicture: user.profilePicture,
      Bio: user.bio,
      FollowersCount: user.followersCount,
      FollowingCount: user.followingCount,
      PostsCount: user.postsCount,
      EngagementRate: user.engagementRate,
      AverageLikes: user.averageLikes,
      AverageComments: user.averageComments,
      Category: user.category,
      Location: JSON.stringify(user.location),
      Language: user.language,
      VerifiedStatus: user.verifiedStatus,
      CollaborationRates: `Post: ${user.collaborationRates.post || 0}, Story: ${user.collaborationRates.story || 0}, Reel: ${user.collaborationRates.reel || 0}`,
      pastCollaborations: user.pastCollaborations,
      mediaKit: user.mediaKit
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
    <div className="table-container">

      <div className="flex mb-3 flex-col items-center md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
        <p className="text-center  items-center md:text-left transition duration-300 ease-in-out transform hover:scale-105">
          <strong>Found: {filteredUsers.length}</strong>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <>
            <label className="mr-2 whitespace-nowrap transition duration-300 ease-in-out transform  hover:scale-105">Items per page:</label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-md py-2 px-2 transition duration-300 ease-in-out transform hover:scale-105"
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
      <div className="overflow-x-auto  p-4 rounded-lg shadow-md">
        <table className="min-w-full  text-sm">
          <thead>
            <tr className="text-base"
            >
              <th className="border px-4 py-2" >S.No </th>
              <th className="border px-4 py-2" onClick={() => handleSort("username")}>User Name {renderSortIcon("username")}</th>
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
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Actions</th>

              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Bookmark</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Profile</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr >
                <td
                  colSpan="10"
                  className="py-3 px-6 text-center text-lg font-semibold"
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((influencer, index) => (
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
                  <td className="border px-4 py-2">
  {`${influencer.location.city}, ${influencer.location.state}, ${influencer.location.country}`}
</td>

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
                      disabled={!userData.permissions.instagram.edit}
                      title={!userData.permissions.instagram.edit
                        ? "You are not allowed to access this feature"
                        : undefined
                      }
                      to={`/editInstagramInfluencer/${influencer._id}`}
                      className=" btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                    >
                      EDIT
                    </Link>
                    <button disabled={!userData.permissions.instagram.delete}
                      title={!userData.permissions.instagram.delete
                        ? "You are not allowed to access this feature"
                        : undefined
                      }
                      onClick={() => deleteInstagramInfluencer(influencer._id)}
                      className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1"
                    >
                      DELETE
                    </button>


                  </td>

                  <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                    <button disabled={!userData.permissions.instagram.bookmark}
                      title={!userData.permissions.instagram.bookmark
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
                    <button disabled={!userData.permissions.instagram.profile}
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
  );
};

export default NewInstagramInfluencerTable;
