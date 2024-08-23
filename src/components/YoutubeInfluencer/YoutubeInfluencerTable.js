import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import ContactForm from '../ContactForm';
import ApplyForm from '../ApplyForm';

const YoutubeInfluencerTable = ({influencers, setInfluencers}) => {
  const { isDarkTheme } = useTheme();
  
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
        const response = await axios.get("https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/getAllYoutubeInfluencer")
       //  const response = await axios.get("http://localhost:5000/youtubeinfluencers/getAllYoutubeInfluencer");
          
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
  // const response = await axios.get(`http://localhost:5000/youtubeinfluencers/getContactsByPublisher/${userId}`);
   const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/youtubeinfluencers/getContactsByPublisher/${userId}`);
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
  return (
    <div className='table-container'>
      <div className='mb-4'>
        <button onClick={handleClearFilter} className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'>Clear Filter</button>
      </div>
      <div className='overflow-x-auto  p-4 rounded-lg shadow-md'>
        <table className='min-w-full bg-white text-sm'>
          <thead>
            <tr className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base'>
              <th className='px-4 py-2'>S.No </th>
              {/*<th className='px-4 py-2'  onClick={() => handleSort("username")}>Username {renderSortIcon("username")}</th>*/}
              <th className='px-4 py-2'  onClick={() => handleSort("followersCount")}>Followers {renderSortIcon("followersCount")}</th>
              {/*<th className='px-4 py-2'  onClick={() => handleSort("videosCount")}>videos Count {renderSortIcon("videosCount")}</th>*/}
              <th className='px-4 py-2'  onClick={() => handleSort("engagementRate")}>Engagement Rate {renderSortIcon("engagementRate")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("averageViews")}>Average Views {renderSortIcon("averageViews")}</th>
              <th className='px-4 py-2'   onClick={() => handleSort("category")}>Category {renderSortIcon("category")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("language")}>Language {renderSortIcon("language")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
             {/* <th className='px-4 py-2'  onClick={() => handleSort("pastCollaborations")}>Past Collaborations {renderSortIcon("pastCollaborations")}</th>
              <th className='px-4 py-2'  onClick={() => handleSort("audienceDemographics")}>Audience Demographics {renderSortIcon("audienceDemographics")}</th>*/}
             <th className="py-3 px-4 uppercase font-semibold text-sm uppercase">Apply</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm uppercase">Actions</th>
              {/*<th className="py-3 px-4 uppercase font-semibold text-sm">Contact</th>*/}
             
            </tr>
          </thead>
          <tbody>
            {influencers.map((influencer,index)=>(
              <tr key={influencer._id} className='hover:bg-gray-100 transition-colors'>
                <td className='border px-4 py-2'>{index+1}</td>
                {/*<td className='border px-4 py-2'>{influencer.username}</td>*/}
               
               
                <td className='border px-4 py-2'>{influencer.followersCount}</td>
                {/*<td className='border px-4 py-2'>{influencer.videosCount}</td>*/}
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
                {/*<td className='border px-4 py-2'>{influencer.pastCollaborations.join(",")}</td>
                <td className='border px-4 py-2'>{influencer.audienceDemographics?
                <div>
                  <div>Age: {influencer.audienceDemographics.age.join(",")}</div>
                  <div>Gender: {influencer.audienceDemographics.gender.join(",")}</div>
                  <div>Geographic Distribution: {influencer.audienceDemographics.geographicDistribution.join(",")}</div>
                </div>:"N/A"}</td>*/}
               <td className='border py-3 px-4'><ApplyForm section="YoutubeInfluencer" publisher={influencer}/></td>
                <td className='border py-3 px-4'>
                <Link
                    to={`/youtubeInfluencerProfile/${influencer._id}`}
                    className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
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
            ))}
          </tbody>
        </table>
      </div>
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