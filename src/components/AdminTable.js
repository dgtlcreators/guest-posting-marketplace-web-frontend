import { useEffect, useState } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const AdminTable = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          //"http://localhost:5000/admin/getAdminData"
          "https://guest-posting-marketplace-web-backend.onrender.com/admin/getAdminData"
        );
        setUsers(response.data);
        setOriginalUsers(response.data); // Store original users data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  const renderSortIcon = (field) => {
    if (sortedField === field) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleClearFilter = () => {
    setUsers(originalUsers); // Reset users to original data
    setSortedField(null); // Reset sorting state
    setSortDirection("asc"); // Reset sorting direction
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={handleClearFilter}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Clear Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2">S.No.</th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("publisherName")}
              >
                Publisher Name {renderSortIcon("publisherName")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("publisherEmail")}
              >
                Publisher Email {renderSortIcon("publisherEmail")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("publisherPhoneNo")}
              >
                Publisher Number {renderSortIcon("publisherPhoneNo")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("publisherURL")}
              >
                Publisher URL {renderSortIcon("publisherURL")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("categories")}
              >
                Categories {renderSortIcon("categories")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("ahrefsDR")}
              >
                ahrefDR {renderSortIcon("ahrefsDR")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("mozDA")}
              >
                mozDA {renderSortIcon("mozDA")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("websiteLanguage")}
              >
                Website Language {renderSortIcon("websiteLanguage")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("linkType")}
              >
                Link Type {renderSortIcon("linkType")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price {renderSortIcon("price")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("mozSpamScore")}
              >
                Moz Spam Score {renderSortIcon("mozSpamScore")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("monthlyTraffic")}
              >
                Monthly Traffic {renderSortIcon("monthlyTraffic")}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.publisherName}</td>
                <td className="px-4 py-2">{user.publisherEmail}</td>
                <td className="px-4 py-2">{user.publisherPhoneNo}</td>
                <td className="px-4 py-2">{user.publisherURL}</td>
                <td className="px-4 py-2">{user.categories}</td>
                <td className="px-4 py-2">{user.ahrefsDR}</td>
                <td className="px-4 py-2">{user.mozDA}</td>
                <td className="px-4 py-2">{user.websiteLanguage}</td>
                <td className="px-4 py-2">{user.linkType}</td>
                <td className="px-4 py-2">{user.price}</td>
                <td className="px-4 py-2">{user.mozSpamScore}</td>
                <td className="px-4 py-2">{user.monthlyTraffic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
