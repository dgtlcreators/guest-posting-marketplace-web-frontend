import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBookmark, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { UserContext } from '../../context/userContext.js';

import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm.js";
import ShowApplyForm from "../OtherComponents/ShowApplyForm.js";
import Bookmark from "../OtherComponents/Bookmark.js";
import Pagination from "../OtherComponents/Pagination.js";


const NewYoutubeInfluencerTable = ({ addYotubeInfluencer, setAddYotubeInfluencer }) => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
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


  const renderSortIcon = (field) => {
    if (sortedField === field) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
    }
    return <FaSort />
  }


  useEffect(() => {
    const fetchInfluencer = async () => {
      try {

        const response = await axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`);

        setInfluencers(response.data.data)
        setOriginalUsers(response.data.data)
      } catch (error) {
        console.error("Error fetching influencers", error);
      }
    }

    fetchInfluencer()
  }, [])

  const createDescriptionElements = (formData, users) => {
    const elements = [
      { key: 'Username', value: users.username },
      { key: 'Full Name', value: users.fullName },
      { key: 'Profile Picture', value: users.profilePicture },
      { key: 'Bio', value: users.bio },
      { key: 'Followers Count', value: users.followersCount },
      { key: 'Following Count', value: users.followingCount },
      { key: 'Posts Count', value: users.postsCount },
      { key: 'Engagement Rate', value: `${users.engagementRate}%` },
      { key: 'Average Likes', value: users.averageLikes },
      { key: 'Average Comments', value: users.averageComments },
      { key: 'Category', value: users.category },
      { key: 'Location', value: JSON.stringify(users.location) },
      { key: 'Language', value: users.language },
      { key: 'Verified Status', value: users.verifiedStatus ? 'Verified' : 'Not Verified' },
      { key: 'Collaboration Rates (Post)', value: users.collaborationRates.post },
      { key: 'Collaboration Rates (Story)', value: users.collaborationRates.story },
      { key: 'Collaboration Rates (Reel)', value: users.collaborationRates.reel },
      { key: 'Past Collaborations', value: users.pastCollaborations.join(', ') },
      { key: 'Media Kit', value: users.mediaKit },
      { key: 'Total results', value: users?.length }
    ];


    const formattedElements = elements
      .filter(element => element.value)
      .map(element => `${element.key}: ${element.value}`)
      .join(', ');
    return `You deleted ${formattedElements}`;
  };
  const generateShortDescription = (formData, users) => {
    const elements = createDescriptionElements(formData, users).split(', ');


    const shortElements = elements.slice(0, 2);

    return `You deleted a YouTube Influencer with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const formData = {}
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Deleted a new YouTube Influencer",
        section: "YouTube Influencer",
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
      await axios.delete(

        `${localhosturl}/youtubeinfluencers/deleteYoutubeInfluencer/${id}`

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

  const handleClearFilter = () => {
    setInfluencers(originalUsers)
    setSortDirection("asc")
    setSortedField(null)
  }

  const filteredUsers = influencers

  const exportDataToCSV = () => {
      const csvData = filteredUsers.map((user, index) => ({
        SNo: index + 1,
    Username:user.username,
  FullName: user.fullname,
 ProfilePicture:user.profilePicture,
 Bio:user.bio,
  FollowersCount:user.followersCount,
  videosCount:user.videosCount,
  EngagementRate: user.engagementRate,
  AverageViews:user.averageViews,
  Category:user.category,
  Location:JSON.stringify(user.location),
  Language:user.language,
 
  CollaborationRates:  `Sponsored Videos: ${user.collaborationRates.sponsoredVideos || 0}, Product Reviews: ${user.collaborationRates.productReviews || 0}, Shoutouts: ${user.collaborationRates.shoutouts || 0}`,//user.collaborationRates,
  pastCollaborations:user.pastCollaborations,
  audienceDemographics:`Age: ${user.audienceDemographics.age || {}}, Gender: ${user.audienceDemographics.gender || {}}, Geographic Distribution: ${user.audienceDemographics.geographicDistribution || {}}`,
  mediaKit:user.mediaKit
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
        await axios.put(`${localhosturl}/youtubeinfluencers/updateYoutubeInfluencer/${influencer._id}`, {
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
    <div className='table-container'>


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
      <div className='overflow-x-auto  p-4 rounded-lg shadow-md'>
        <table className='min-w-full  text-sm'//bg-white
        >
          <thead>
            <tr className='border text-base'//bg-gradient-to-r from-purple-500 to-pink-500 text-white 
            >
              <th className='border px-4 py-2'>S.No </th>
              <th className='border px-4 py-2' onClick={() => handleSort("username")}>User Name {renderSortIcon("username")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("fullname")}>Full Name {renderSortIcon("fullname")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("profilePicture")}>Profile Picture {renderSortIcon("profilePicture")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("videosCount")}>videos Count {renderSortIcon("videosCount")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("averageViews")}>Average Views {renderSortIcon("averageViews")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className='border px-4 py-2' onClick={() => handleSort("audienceDemographics")}>Audience Demographics {renderSortIcon("audienceDemographics")}</th>
              <th className='border  px-4 py-2' onClick={() => handleSort("mediaKit")}>mediaKit  {renderSortIcon("mediaKit")}</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Actions</th>
           { /*  <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>*/}
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
              <tr key={influencer._id} className='hover:bg-gray-100 transition-colors'>
                <td className='border px-4 py-2'>{index + 1}</td>
                <td className='border px-4 py-2'>{influencer.username}</td>
                <td className='border px-4 py-2'>{influencer.fullname}</td>
                <td className='border px-4 py-2'>
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
                <td className='border px-4 py-2'>{influencer.bio}</td>
                <td className='border px-4 py-2'>{influencer.followersCount}</td>
                <td className='border px-4 py-2'>{influencer.videosCount}</td>
                <td className='border px-4 py-2'>{influencer.engagementRate}</td>
                <td className='border px-4 py-2'>{influencer.averageViews}</td>
                <td className='border px-4 py-2'>{influencer.category}</td>
                <td className="border px-4 py-2">
  {`${influencer.location.city}, ${influencer.location.state}, ${influencer.location.country}`}
</td>

                <td className='border px-4 py-2'>{influencer.language}</td>
                <td className='border px-4 py-2'>{influencer.collaborationRates ? (
                  <div>
                    <div>Sponsored Videos: {influencer.collaborationRates.sponsoredVideos}</div>
                    <div>Product Reviews: {influencer.collaborationRates.productReviews}</div>
                    <div>Shoutouts: {influencer.collaborationRates.shoutouts}</div>
                  </div>
                ) : "N/A"}</td>
                <td className='border px-4 py-2'>{influencer.pastCollaborations.join(",")}</td>
                <td className='border px-4 py-2'>{influencer.audienceDemographics ?
                  <div>
                    <div>Age: {influencer.audienceDemographics.age.join(",")}</div>
                    <div>Gender: {influencer.audienceDemographics.gender.join(",")}</div>
                    <div>Geographic Distribution: {influencer.audienceDemographics.geographicDistribution.join(",")}</div>
                  </div> : "N/A"}</td>
                <td className='border px-4 py-2'>
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
                <td className='border py-3 px-4'>
                  <Link disabled={!userData.permissions.youtube.edit}
                      title={!userData.permissions.youtube.edit
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                    to={`/edityoutubeInfluencer/${influencer._id}`}
                    className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                  >
                    EDIT
                  </Link>
                  <button disabled={!userData.permissions.youtube.delete}
                      title={!userData.permissions.youtube.delete
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                    onClick={() => deleteInstagramInfluencer(influencer._id)}
                    className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1"
                  >
                     DELETE
                  </button>
                </td>
                {/*<td className='border py-3 px-4'>
                  <ApplyForm section="YoutubeInfluencer" publisher={influencer}/>
                  <ShowApplyForm section="YoutubeInfluencer" publisher={influencer} />
                  </td>*/}
               <td  className="border py-3 px-2 md:px-6 text-center text-md font-semibold"> 
                 {/* <button className="text-gray-600  focus:outline-none transition-transform transform hover:-translate-y-1"
                ><Bookmark  section="YoutubeInfluencer" publisher={influencer}/></button>*/}
                 <button disabled={!userData.permissions.youtube.bookmark}
                      title={!userData.permissions.youtube.bookmark
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                        onClick={() => handleToggleBookmark(influencer)}
                        className={`text-gray-600 focus:outline-none transition-transform transform hover:-translate-y-1 ${influencer.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                      >
                        <FaBookmark />
                        {/*influencer.isBookmarked ? ' Bookmarked' : ' Bookmark'*/}
                      </button></td>
                <td className='border py-3 px-4'>
                <Link disabled={!userData.permissions.youtube.profile}
                      title={!userData.permissions.youtube.profile
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                    to={`/youtubeInfluencerProfile/${influencer._id}`}
                    className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                  >
                    View Profile
                  </Link>
               
                </td>


              </tr>
            )))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length>0 && <Pagination
        totalItems={filteredUsers.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />}

    </div>
  )
}

export default NewYoutubeInfluencerTable