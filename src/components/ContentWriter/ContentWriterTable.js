

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ContactForm from '../ContactForm';
import { useTheme } from '../../context/ThemeProvider';


const ContentWriterTable = ({contentWriters,setContentWriters}) => {
  const { isDarkTheme } = useTheme();
 // const [contentWriters, setContentWriters] = useState([]);
  const [originalWriters, setOriginalWriters] = useState(contentWriters);
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
    const sortedWriters = [...contentWriters].sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setContentWriters(sortedWriters);
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
    setContentWriters(originalWriters);
  };


  const handleBuyClick = (publisher) => {
    setSelectedPublisher(publisher);
    setShowContactForm(true);
  };

  const handleShowContactDetails = async (userId) => {
    setShowContactDetails(true)
    try {
     //const response = await axios.get(`http://localhost:5000/contentwriters/getContactsByPublisher/${userId}`);
     const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/getContactsByPublisher/${userId}`);
      console.log(response.data)
      //toast.success("Fetching ")
      setSelectedUserContacts(response.data);
      
    } catch (error) {
      if (error.response) {
        console.log("error",error)
        console.log(error.response.data, error.response.status, error.response.headers);
        if (error.response.status === 404) {
          setSelectedUserContacts(error.response.data.msg);
        }
        toast.error(`Error fetching contact details: ${error.response.data.msg}`);
      } else if (error.request) {
        //console.log(error.request);
        toast.error("No response received from server");
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

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setShowContactForm(false);
    toast.success("Contact form submitted successfully");
  };

  return (
    <div className="table-container">
      <div className="mb-4">
        <button
          onClick={handleClearFilter}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Clear Filter
        </button>
      </div>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base">
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2" onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("experience")}>Experience {renderSortIcon("experience")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("expertise")}>Expertise {renderSortIcon("expertise")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("languages")}>Languages {renderSortIcon("languages")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("industry")}>Industries {renderSortIcon("industry")}</th>
               <th className="px-4 py-2" onClick={() => handleSort("subCategories")}>Subcategories {renderSortIcon("subCategories")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentWriters.map((writer, index) => (
              <tr key={writer._id} className="hover:bg-gray-100 transition-colors">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{writer.name}</td>
                <td className="border px-4 py-2">{writer.bio}</td>
                <td className="border px-4 py-2">{writer.location}</td>
                <td className="border px-4 py-2">{writer.experience}</td>
                <td className="border px-4 py-2">
                <ul className="list-disc pl-5">
                  {writer.expertise.map((expert, idx) => (
                     <li key={idx}>
                    <div key={idx}>{expert.type}</div>
                    </li>
                  ))}
                  </ul>
                </td>
                <td className="border px-4 py-2">
                <ul className="list-disc pl-5">
                 
                  {writer.languages.map((lang, idx) => (
                     <li key={idx} className="mb-2">
                    <span key={idx} className="">
                      {/*`${lang.name==="Other"?`Other: ${lang.other}`:lang.name} (${lang.proficiency})`*/}
                       {`${lang.name} (${lang.proficiency})`}
                    </span></li>
                  ))}
                  </ul>
                </td>
                <td className="border px-4 py-2">
          <ul className="list-disc pl-5">
            {writer.industry.map((industries, idx) => (
              <li key={idx}>{industries.type}</li>
            ))}
          </ul>
        </td>
        <td className="border px-4 py-2">
          <ul className="list-disc pl-5">
            {writer.industry.map((industries, idx) => (
              <li key={idx}>
                <strong>{industries.type}:</strong>
                <ul className="list-disc pl-5">
                  {industries.subCategories.map((subCategory, subIdx) => (
                    <li key={subIdx}>{subCategory?.type}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </td>
                <td className="border px-4 py-2 text-center">
                  {writer.collaborationRates ? (
                    <div>
                      <div>Post: {writer.collaborationRates.post}</div>
                      <div>Story: {writer.collaborationRates.story}</div>
                      <div>Reel: {writer.collaborationRates.reel}</div>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="border py-3 px-4">
                <button
                    onClick={() => handleBuyClick(writer)}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                  >
                    Buy Contact
                  </button>
                  <button
                  onClick={() => handleShowContactDetails(writer._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Show Contact
                </button>
                 
                </td>
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
          url="contentwriters"
        />
      )}
    </div>
  );
};

export default ContentWriterTable
