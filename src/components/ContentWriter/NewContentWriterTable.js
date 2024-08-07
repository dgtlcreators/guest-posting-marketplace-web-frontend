import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewContentWriterTable = () => {
  const [contentWriters, setContentWriters] = useState([]);
  const [originalWriters, setOriginalWriters] = useState([]);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContentWriters = async () => {
      try {
        
        const response = await axios.get("https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/getallcontentwriters");
       // const response = await axios.get("http://localhost:5000/contentwriters/getallcontentwriters");
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

  const deleteContentWriter = async (id) => {
    try {
      await axios.delete(`https://guest-posting-marketplace-web-backend.onrender.com/contentwriters/deletecontentwriter/${id}`);
     // await axios.delete(`http://localhost:5000/contentwriters/deletecontentwriter/${id}`);
      toast.success("Content Writer Deleted Successfully");
      setContentWriters(contentWriters.filter((writer) => writer._id !== id));
    } catch (error) {
      toast.error("Error deleting Content Writer");
      console.error("Error deleting Content Writer:", error);
    }
  };

  const handleViewProfile = (influencer) => {
    navigate(`/contentWriterprofile/${influencer._id}`);
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
             
              <th className="px-4 py-2" onClick={() => handleSort("experience")}>Experience {renderSortIcon("experience")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("location")}>Location {renderSortIcon("location")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("expertise")}>Expertise {renderSortIcon("expertise")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("languages")}>Languages {renderSortIcon("languages")}</th>
              <th className="px-4 py-2" onClick={() => handleSort("collaborationRates")}>Collaboration Rates {renderSortIcon("collaborationRates")}</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Profile</th>
            </tr>
          </thead>
          <tbody>
            {contentWriters.map((writer, index) => (
              <tr key={writer._id} className="hover:bg-gray-100 transition-colors">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{writer.name}</td>
                <td className="border px-4 py-2">{writer.bio}</td>
                <td className="border px-4 py-2">{writer.experience}</td>
                <td className="border px-4 py-2">{writer.location}</td>
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
                    onClick={() => deleteContentWriter(writer._id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded my-2"
                  >
                    <i className="fa-solid fa-trash"></i> DELETE
                  </button>
                  <Link
                    to={`/editContentWriter/${writer._id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  >
                    EDIT
                  </Link>
                </td>
                <td className="border py-3 px-4"> <button
                    onClick={() => handleViewProfile(writer)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Profile
                  </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewContentWriterTable;
