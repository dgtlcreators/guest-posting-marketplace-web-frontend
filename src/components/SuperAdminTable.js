import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; 
import ContactForm from "./ContactForm.js";

const SuperAdminTable = () => {
  const [users, setUsers] = useState([]);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedUserContacts, setSelectedUserContacts] = useState([]);
  const [showContactDetails,setShowContactDetails]=useState(false)
  const [originalUsers, setOriginalUsers] = useState([]);

  


  const fetchData = async () => {
    try {
      
      const response = await axios.get(
      //  "http://localhost:5000/superAdmin/getAllAdminData"
       "https://guest-posting-marketplace-web-backend.onrender.com/superAdmin/getAllAdminData"
      );
      setUsers(response.data);
      setOriginalUsers(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        
       // `http://localhost:5000/superAdmin/deleteOneAdminData/${userId}`
        `https://guest-posting-marketplace-web-backend.onrender.com/superAdmin/deleteOneAdminData/${userId}`
      );
      toast.success("Client Deleted Successfully");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Error deleting user:", error);
    }
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (sortedField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortedField(field);
    setSortDirection(direction);
    const sortedUsers = [...users].sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilter = () => {
    setUsers(originalUsers)
    setSortDirection("asc")
    setSortedField(null)
    setSearchTerm(""); 
   
  };

  const filteredUsers = users.filter((user) =>
    user.publisherURL?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSortIcon = (field) => {
    if (sortedField === field) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />; // Default icon when not sorted
  };

  const handleBuyClick = (publisher) => {
    setSelectedPublisher(publisher);
    setShowContactForm(true);
  };

  const handleShowContactDetails = async (userId) => {
    setShowContactDetails(true)
    try {
     //const response = await axios.get(`http://localhost:5000/superAdmin/getContactsByPublisher/${userId}`);
     const response = await axios.get(`https://guest-posting-marketplace-web-backend.onrender.com/superAdmin/getContactsByPublisher/${userId}`);
      console.log(response.data)
      setSelectedUserContacts(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log(error.response.data, error.response.status, error.response.headers);
        if (error.response.status === 404) {
          setSelectedUserContacts(error.response.data.msg);
        }
        toast.error(`Error fetching contact details: ${error.response.data.msg}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        toast.error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        toast.error(`Error fetching contact details: ${error.message}`);
      }
      console.error("Error fetching contact details:", error);
    }
  };
  
  // Close contact form function
  const handleCloseContactForm = () => {
    setShowContactForm(false);
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    // Handle contact form submission
    setShowContactForm(false);
    toast.success("Contact form submitted successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by URL"
          value={searchTerm}
          onChange={handleSearch}
          className="form-input border rounded p-2 w-full"
        />
        <button
          onClick={handleClearFilter}
          className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Clear Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm">
                S.No.
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("publisherName")}
              >
                Publisher Name {renderSortIcon("publisherName")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("publisherEmail")}
              >
                Publisher Email {renderSortIcon("publisherEmail")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("publisherPhoneNo")}
              >
                Publisher Number {renderSortIcon("publisherPhoneNo")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("publisherURL")}
              >
                Publisher URL {renderSortIcon("publisherURL")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("categories")}
              >
                Categories {renderSortIcon("categories")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("ahrefsDR")}
              >
                ahrefDR {renderSortIcon("ahrefsDR")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("mozDA")}
              >
                mozDA {renderSortIcon("mozDA")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("websiteLanguage")}
              >
                Website Language {renderSortIcon("websiteLanguage")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("linkType")}
              >
                Link Type {renderSortIcon("linkType")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price {renderSortIcon("price")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("mozSpamScore")}
              >
                Moz Spam Score {renderSortIcon("mozSpamScore")}
              </th>
              <th
                className="py-3 px-4 uppercase font-semibold text-sm cursor-pointer"
                onClick={() => handleSort("monthlyTraffic")}
              >
                Monthly Traffic {renderSortIcon("monthlyTraffic")}
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              <th  className="py-3 px-4 uppercase font-semibold text-sm">Contact</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="bg-gray-100 border-b border-gray-200">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{user.publisherName}</td>
                <td className="py-3 px-4">{user.publisherEmail}</td>
                <td className="py-3 px-4">{user.publisherPhoneNo}</td>
                <td><a href={user.publisherURL} target="_blank" rel="noopener noreferrer"  className=" text-blue-500 hover:underline">
                    {user.publisherURL}
                  </a></td>
                <td className="py-3 px-4">{user.categories}</td>
                <td className="py-3 px-4">{user.ahrefsDR}</td>
                <td className="py-3 px-4">{user.mozDA}</td>
                <td className="py-3 px-4">{user.websiteLanguage}</td>
                <td className="py-3 px-4">{user.linkType}</td>
                <td className="py-3 px-4">{user.price}</td>
                <td className="py-3 px-4">{user.mozSpamScore}</td>
                <td className="py-3 px-4">{user.monthlyTraffic}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded my-2"
                  >
                    <i className="fa-solid fa-trash"></i> DELETE
                  </button>
                  <Link
                    to={`/editadmindata/${user._id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  >
                    EDIT
                  </Link>
                
                </td>
                <td  className="py-3 px-4">
                <button
                    onClick={() => handleBuyClick(user)}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                  >
                    Buy Contact
                  </button>
                  <button
                  onClick={() => handleShowContactDetails(user._id)}
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


       {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          publisher={selectedPublisher}
          onClose={handleCloseContactForm}
        />
      )}
      {/*showContactForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contact Publisher</h2>
            <form onSubmit={handleContactFormSubmit}>
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-2">Your Name</label>
                <input type="text" className="form-input border rounded p-2" required />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-2">Your Email</label>
                <input type="email" className="form-input border rounded p-2" required />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-2">Message</label>
                <textarea className="form-input border rounded p-2" required></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )*/}
    </div>
  );
};

export default SuperAdminTable;
