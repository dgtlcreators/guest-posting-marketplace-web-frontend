

import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ContactForm from '../ContactForm';
import { useTheme } from '../../context/ThemeProvider';

import { UserContext } from '../../context/userContext';

import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm";
import Bookmark from "../OtherComponents/Bookmark";
import Pagination from "../OtherComponents/Pagination";


const ContentWriterTable = ({ contentWriters, setContentWriters }) => {
  const { isDarkTheme } = useTheme();
  // const [contentWriters, setContentWriters] = useState([]);
  const [originalWriters, setOriginalWriters] = useState(contentWriters);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedUserContacts, setSelectedUserContacts] = useState([]);
  const [showContactDetails, setShowContactDetails] = useState(false)
  const { userData, localhosturl } = useContext(UserContext);



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
      const response = await axios.get(`${localhosturl}/contentwriters/getContactsByPublisher/${userId}`);

      console.log(response.data)
      //toast.success("Fetching ")
      setSelectedUserContacts(response.data);

    } catch (error) {
      if (error.response) {
        console.log("error", error)
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

  const filteredUsers = contentWriters

  const exportDataToCSV = () => {
    const csvData = filteredUsers.map((user, index) => ({
      SNo: index + 1,
      Name: user.name,
      Email: user.email,
      Experience: user.experience,
      
      Location: JSON.stringify(user.location),
      Industry: user.industry,
      Expertise: user.expertise,
      Language: user.language,
      subCategories: user.subCategories,
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
        await axios.put(`${localhosturl}/contentwriters/updatecontentwriter/${influencer._id}`, {
            isBookmarked: updatedBookmarkStatus,
        });
        if (updatedBookmarkStatus) {
          toast.success("Added to Bookmarks!");
        } else {
          toast.success("Removed from Bookmarks!");
        }

        setContentWriters(prev =>
            prev.map(i => i._id === influencer._id ? { ...i, isBookmarked: updatedBookmarkStatus } : i)
        );
    } catch (error) {
        console.error('Error updating bookmark status', error);
    }
};

  return (
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

      <div className="overflow-x-auto  p-4 rounded-lg shadow-md">
        <table className="min-w-full  text-sm"//bg-white
        >
          <thead>
            <tr className=" text-base"//bg-gradient-to-r from-purple-500 to-pink-500 text-white
            >
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2" onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("experience")}>Experience {renderSortIcon("experience")}</th>
              {/*<th className="border px-4 py-2" onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>*/}
              <th className="border px-4 py-2" onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("industry")}>Industries {renderSortIcon("industry")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("expertise")}>Expertise {renderSortIcon("expertise")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("languages")}>Languages {renderSortIcon("languages")}</th>

              <th className="border px-4 py-2" onClick={() => handleSort("subCategories")}>Subcategories {renderSortIcon("subCategories")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Bookmark</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Profile</th>
              {/*<th className="py-3 px-4 uppercase font-semibold text-sm uppercase">Actions</th>*/}
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
              paginatedUsers.map((writer, index) => (
                <tr key={writer._id} className="transition-colors"//hover:bg-gray-100 
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{writer.name}</td>
                  <td className="border px-4 py-2">{writer.experience}</td>
                  <td className="border px-4 py-2">{writer.email}</td>
                  {/* <td className="border px-4 py-2">{writer.bio}</td>*/}
                  <td className="border px-4 py-2">{JSON.stringify(writer.location)}</td>
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
                  <td className="border px-4 py-2 text-center"><ApplyForm section="ContenWriters" publisher={writer} /></td>
                  <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                  {/*  <button className="text-gray-600  focus:outline-none transition-transform transform hover:-translate-y-1"
                    ><Bookmark section="ContenWriters" publisher={writer} /></button>*/}
                    <button
                    disabled={!userData.permissions.contentWriter.bookmark}
                    title={!userData.permissions.contentWriter.bookmark
                      ? "You are not allowed to access this feature"
                      : undefined  // : ""
                    }
                        onClick={() => handleToggleBookmark(writer)}
                        className={`text-gray-600 focus:outline-none transition-transform transform hover:-translate-y-1 ${writer.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                      >
                        <FaBookmark />
                        {/*writer.isBookmarked ? ' Bookmarked' : ' Bookmark'*/}
                      </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <Link
                      disabled={!userData.permissions.contentWriter.profile}
                      title={!userData.permissions.contentWriter.profile
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                      to={`/contentWriterprofile/${writer._id}`}
                      className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                    >
                      View Profile
                    </Link>
                  </td>


                  {/* <td className="border py-3 px-4">
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
                 
                </td>*/}
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
