import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Import icons for sorting

const SuperAdminTable = () => {
  const [users, setUsers] = useState([]);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/superAdmin/getAllAdminData"
      );
      setUsers(response.data);
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
        `http://localhost:5000/superAdmin/deleteOneAdminData/${userId}`
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
    setSearchTerm(""); // Clear search term
    fetchData(); // Fetch original data again
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
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="bg-gray-100 border-b border-gray-200">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{user.publisherName}</td>
                <td className="py-3 px-4">{user.publisherEmail}</td>
                <td className="py-3 px-4">{user.publisherPhoneNo}</td>
                <td className="py-3 px-4">{user.publisherURL}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminTable;
