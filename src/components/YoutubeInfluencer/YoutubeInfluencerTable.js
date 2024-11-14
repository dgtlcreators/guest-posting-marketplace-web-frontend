import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBookmark, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import ContactForm from '../ContactForm.js';
import { UserContext } from '../../context/userContext.js';

import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm.js";
import Bookmark from "../OtherComponents/Bookmark.js";
import Pagination from "../OtherComponents/Pagination.js";

const YoutubeInfluencerTable = ({influencers, setInfluencers}) => {
  const { isDarkTheme } = useTheme();
  const { userData,localhosturl } = useContext(UserContext);
  
  //const [influencers, setInfluencers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);

  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedUserContacts, setSelectedUserContacts] = useState([]);
  const [showContactDetails,setShowContactDetails]=useState(false)


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
       
         const response = await axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`);
          
       // setInfluencers(response.data.data)
        setOriginalUsers(response.data.data)
      } catch (error) {
        console.error("Error fetching influencers", error);
      }
    }

    fetchInfluencer()
  },[])

 

const handleClearFilter=()=>{
  setInfluencers(originalUsers)
  setSortDirection("asc")
  setSortedField(null)
}


const handleBuyClick = (publisher) => {
  setSelectedPublisher(publisher);
  setShowContactForm(true);
};

const handleShowContactDetails = async (userId) => {
  setShowContactDetails(true)
  try {
   const response = await axios.get(`${localhosturl}/youtubeinfluencers/getContactsByPublisher/${userId}`);
  
    console.log(response.data)
    //toast.success("Fetching ")
   setSelectedUserContacts(response.data.data);
  //setSelectedUserContacts(Array.isArray(response.data) ? response.data : []); 
    
  } catch (error) {
  //  console.log("This is error ",error)
    if (error.response) {
      console.log("error",error)
      console.log(error.response.data, error.response.status, error.response.headers);
      if (error.response.status === 404) {
        
        setSelectedUserContacts(error.response.data.msg);
      }
      //toast.error(`Error fetching contact details: ${error.response.data.msg}`);
    } else if (error.request) {
      //console.log(error.request);
      //toast.error("No response received from server");
    } else {
      
      console.log("Error", error.message);
      //toast.error(`Error fetching contact details: ${error.message}`);
    }
    console.error("Error fetching contact details:", error);
  }
};

const handleCloseContactForm = () => {
  setShowContactForm(false);
};

const filteredUsers = influencers

const exportDataToCSV = () => {
  const csvData = filteredUsers.map((user, index) => ({
    SNo: index + 1,
  //  Username:user.username,
  FullName: user.fullname,
 ProfilePicture:user.profilePicture,
// Bio:user.bio,
  FollowersCount:user.followersCount,
 // videosCount:user.videosCount,
  EngagementRate: user.engagementRate,
  AverageViews:user.averageViews,
  Category:user.category,
  Location:JSON.stringify(user.location),
  Language:user.language,
 
  CollaborationRates:  `Sponsored Videos: ${user.collaborationRates.sponsoredVideos || 0}, Product Reviews: ${user.collaborationRates.productReviews || 0}, Shoutouts: ${user.collaborationRates.shoutouts || 0}`,//user.collaborationRates,
 // pastCollaborations:user.pastCollaborations,
 // audienceDemographics:`Age: ${user.audienceDemographics.age || {}}, Gender: ${user.audienceDemographics.gender || {}}, Geographic Distribution: ${user.audienceDemographics.geographicDistribution || {}}`,
 // mediaKit:user.mediaKit
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

     
      <div className='overflow-x-auto  p-4 rounded-lg shadow-md'>
        <table className='min-w-full  text-sm'//bg-white
        >
          <thead>
            <tr className='border  text-base'//bg-gradient-to-r from-purple-500 to-pink-500 text-white
            >
              <th className='border px-4 py-2'>S.No </th>
              
              {/*<th className='border px-4 py-2'  onClick={() => handleSort("username")}>Username {renderSortIcon("username")}</th>*/}
              <th className='border px-4 py-2'  onClick={() => handleSort("fullname")}>Fullname {renderSortIcon("fullname")}</th>
              <th className='border px-4 py-2'  onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              {/*<th className='border px-4 py-2'  onClick={() => handleSort("videosCount")}>videos Count {renderSortIcon("videosCount")}</th>*/}
              <th className='border px-4 py-2'  onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
              <th className='border px-4 py-2'  onClick={() => handleSort("averageViews")}>Average Views {renderSortIcon("averageViews")}</th>
              <th className='border px-4 py-2'   onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
              <th className='border px-4 py-2'  onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className='border px-4 py-2'  onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
              <th className='border px-4 py-2'  onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
             {/* <th className='border px-4 py-2'  onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className='border px-4 py-2'  onClick={() => handleSort("audienceDemographics")}>Audience Demographics {renderSortIcon("audienceDemographics")}</th>*/}
             <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Bookmark</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Profile</th>
              {/*<th className="border py-3 px-4 uppercase font-semibold text-sm">Contact</th>*/}
             
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
              paginatedUsers.map((influencer,index)=>(
              <tr key={influencer._id} className=' transition-colors'//hover:bg-gray-100
              >
                <td className='border px-4 py-2'>{index+1}</td>
                {/*<td className='border px-4 py-2'>{influencer.username}</td>*/}
                <td className='border px-4 py-2'>{influencer.fullname}</td>
               
                <td className='border px-4 py-2'>{influencer.followersCount}</td>
                {/*<td className='border px-4 py-2'>{influencer.videosCount}</td>*/}
                <td className='border px-4 py-2'>{influencer.engagementRate}</td>
                <td className='border px-4 py-2'>{influencer.averageViews}</td>
                <td className='border px-4 py-2'>{influencer.category}</td>
                <td className='border px-4 py-2'>{JSON.stringify(influencer.location)}</td>
                <td className='border px-4 py-2'>{influencer.language}</td>
                <td className='border px-4 py-2'>{influencer.collaborationRates?(
                  <div>
                    <div>Sponsored Videos: {influencer.collaborationRates.sponsoredVideos}</div>
                    <div>Product Reviews: {influencer.collaborationRates.productReviews}</div>
                    <div>Shoutouts: {influencer.collaborationRates.shoutouts}</div>
                  </div>
                ):"N/A"}</td>
                {/*<td className='border px-4 py-2'>{influencer.pastCollaborations.join(",")}</td>
                <td className='border px-4 py-2'>{influencer.audienceDemographics?
                <div>
                  <div>Age: {influencer.audienceDemographics.age.join(",")}</div>
                  <div>Gender: {influencer.audienceDemographics.gender.join(",")}</div>
                  <div>Geographic Distribution: {influencer.audienceDemographics.geographicDistribution.join(",")}</div>
                </div>:"N/A"}</td>*/}
               <td className='border py-3 px-4'><ApplyForm section="YoutubeInfluencer" publisher={influencer}/></td>
               <td  className="border py-3 px-2 md:px-6 text-center text-md font-semibold"> 
                  {/*<button className="text-gray-600  focus:outline-none transition-transform transform hover:-translate-y-1"
                ><Bookmark  section="YoutubeInfluencer" publisher={influencer}/></button>*/}
                 <button
                 disabled={!userData.permissions.youtube.bookmark}
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
                      </button>
                </td>
                <td className='border py-3 px-4'>
                <Link
                disabled={!userData.permissions.youtube.profile}
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
                {/*<td className="border py-3 px-4">
                <button
                    onClick={() => handleBuyClick(influencer)}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                  >
                    Buy Contact
                  </button>
                  <button
                  onClick={() => handleShowContactDetails(influencer._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Show Contact
                </button>
                 
                </td>*/}
                
                
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
      {showContactDetails && Array.isArray(selectedUserContacts) && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Contact Details:</h3>
        <button
          onClick={() => setShowContactDetails(false)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Contact Name</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Contact Email</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Contact Message</th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">Contact Time</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
        {selectedUserContacts.map((contact, index) => console.log("contact,index ",contact,index))}
          {selectedUserContacts.map((contact, index) => (
            <tr key={index} className="bg-gray-100 border-b border-gray-200">
              <td className="py-3 px-4">{contact.name}</td>
              <td className="py-3 px-4">{contact.email}</td>
              <td className="py-3 px-4">{contact.message}</td>
              <td className="py-3 px-4">{contact.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{showContactDetails && !Array.isArray(selectedUserContacts) && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Contact Details:</h3>
        <button
          onClick={() => setShowContactDetails(false)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-4 text-red-500 font-bold">{selectedUserContacts}</div>
    </div>
  </div>
)}
      {showContactForm && (
        <ContactForm
          publisher={selectedPublisher}
          onClose={handleCloseContactForm}
          url="youtubeinfluencers"
        />
      )}
    </div>
  )
}

export default YoutubeInfluencerTable