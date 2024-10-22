
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/userContext';

import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm";
import ShowApplyForm from "../OtherComponents/ShowApplyForm";
import Bookmark from "../OtherComponents/Bookmark";
import Pagination from "../OtherComponents/Pagination";


const NewContentWriterTable = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const [contentWriters, setContentWriters] = useState([]);
  const [originalWriters, setOriginalWriters] = useState([]);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContentWriters = async () => {
      try {

        const response = await axios.get(`${localhosturl}/contentwriters/getallcontentwriters`);

        setContentWriters(response.data.data);
        setOriginalWriters(response.data.data);
      } catch (error) {
        console.error("Error fetching Content Writers", error);
      }
    };

    fetchContentWriters();
  }, []);

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

  const createDescriptionElements = (formData, users) => {
    const elements = [
      { key: 'Name', value: users?.name },
      { key: 'Bio', value: users?.bio },
      { key: 'Experience', value: users?.experience },
      { key: 'Expertise', value: users?.expertise.map(exp => `${exp.type} ${exp.other ? ' (Other: ' + exp.other + ')' : ''}`).join(', ') },
      { key: 'Location', value: users?.location },
      { key: 'Languages', value: users?.languages.map(lang => `${lang.name} ${lang.other ? ' (Other: ' + lang.other + ')' : ''} - Proficiency: ${lang.proficiency}`).join(', ') },
      { key: 'Collaboration Rates (Post)', value: users?.collaborationRates.post },
      { key: 'Collaboration Rates (Story)', value: users?.collaborationRates.story },
      { key: 'Collaboration Rates (Reel)', value: users?.collaborationRates.reel },
      { key: 'Email', value: users?.email },
      { key: 'Industry', value: users?.industry.map(ind => `${ind.type} ${ind.other ? ' (Other: ' + ind.other + ')' : ''}${ind.subCategories.length ? ' - Subcategories: ' + ind.subCategories.map(sub => `${sub.type}${sub.other ? ' (Other: ' + sub.other + ')' : ''}`).join(', ') : ''}`).join(', ') }
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

    return `You deleted a Content Writer with ${shortElements.join(' and ')} successfully.`;
  };

  const pastactivitiesAdd = async (users) => {
    const formData = {}
    const description = createDescriptionElements(formData, users);
    const shortDescription = generateShortDescription(formData, users);

    try {
      const activityData = {
        userId: userData?._id,
        action: "Deleted a Content Writer",
        section: "Content Writer",
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

  const deleteContentWriter = async (id) => {
    try {

      await axios.delete(`${localhosturl}/contentwriters/deletecontentwriter/${id}`);
      toast.success("Content Writer Deleted Successfully");
      const user = contentWriters.find((user) => user._id === id);

      await pastactivitiesAdd(user);
      pastactivitiesAdd()
      setContentWriters(contentWriters.filter((writer) => writer._id !== id));
    } catch (error) {
      toast.error("Error deleting Content Writer");
      console.error("Error deleting Content Writer:", error);
    }
  };

  const handleViewProfile = (influencer) => {
    navigate(`/contentWriterprofile/${influencer._id}`);
  };

  const filteredUsers = contentWriters

  const exportDataToCSV = () => {
    const csvData = filteredUsers.map((user, index) => ({
      SNo: index + 1,
      Name: user.name,
      Bio: user.bio,
      Email: user.email,
      Experience: user.experience,
      expertise: user.expertise,
      Location: user.location,
      Gender:user?.gender || "",
      WordCount:user?.wordCount || "",

      Language: user.language,
      Industry: `${user.industry}: ${user.industry.subCategories}`,



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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleToggleBookmark = async (influencer) => {
    const updatedBookmarkStatus = !influencer.isBookmarked;
    console.log(`Updating bookmark status for ${influencer._id} to ${updatedBookmarkStatus}`);
  
    try {
      const response = await axios.put(`${localhosturl}/contentwriters/updatecontentwriter/${influencer._id}`, {
        isBookmarked: updatedBookmarkStatus,
      });
        console.log('Response from server:', response.data);
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
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base">
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2" onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("bio")}>Bio {renderSortIcon("bio")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("gender")}>Gender {renderSortIcon("gender")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("wordCount")}>WordCount {renderSortIcon("wordCount")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("experience")}>Experience {renderSortIcon("experience")}</th>
              
              <th className="border px-4 py-2" onClick={() => handleSort("expertise")}>Expertise {renderSortIcon("expertise")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("languages")}>Languages {renderSortIcon("languages")}</th>
              
              <th className="border px-4 py-2" onClick={() => handleSort("subCategories")}>Subcategories {renderSortIcon("subCategories")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className="border px-4 py-2" onClick={() => handleSort("industry")}>Industries {renderSortIcon("industry")}</th>
              <th className="border py-3 px-2 md:px-6 text-left uppercase ">Actions</th>
             {/* <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>*/}
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
              paginatedUsers.map((writer, index) => (
                <tr key={writer._id} className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{writer.name}</td>
                  <td className="border px-4 py-2">{writer.bio}</td>
                  <td className="border px-4 py-2">{writer.email}</td>
                  <td className="border px-4 py-2">{writer.gender}</td>
                  <td className="border px-4 py-2">{writer.wordCount}</td>
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
                  <td className="border px-4 py-2">
                    <ul className="list-disc pl-5">
                      {writer.industry.map((industries, idx) => (
                        <li key={idx}>{industries.type}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border py-3 px-4">
                  <Link disabled={!userData.permissions.contentWriter.edit}
                      title={!userData.permissions.contentWriter.edit
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                      to={`/editContentWriter/${writer._id}`}
                      className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                    >
                      EDIT
                    </Link>
                    <button  disabled={!userData.permissions.contentWriter.delete}
                      title={!userData.permissions.contentWriter.delete
                        ? "You are not allowed to access this feature"
                        : undefined  // : ""
                      }
                      onClick={() => deleteContentWriter(writer._id)}
                      className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1"
                    >
                      DELETE
                    </button>
                
                  </td>
                  {/*<td className="border px-4 py-2 text-center">
                    <ApplyForm section="ContenWriters" publisher={writer} />
                    <ShowApplyForm  section="ContenWriters" publisher={writer} />
                    </td>*/}
                  <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                    {/*<button className="text-gray-600  focus:outline-none transition-transform transform hover:-translate-y-1"
                    ><Bookmark section="ContenWriters" publisher={writer} /></button>*/}
                     <button disabled={!userData.permissions.contentWriter.bookmark}
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
                  <td className="border py-3 px-4"> <button
                  disabled={!userData.permissions.contentWriter.profile}
                  title={!userData.permissions.contentWriter.profile
                    ? "You are not allowed to access this feature"
                    : undefined  // : ""
                  }
                    onClick={() => handleViewProfile(writer)}
                    className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                  >
                    View Profile
                  </button></td>
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

export default NewContentWriterTable;
