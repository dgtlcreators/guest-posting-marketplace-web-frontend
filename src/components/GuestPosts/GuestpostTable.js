
import React, { useContext, useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { UserContext } from "../../context/userContext.js";

import { saveAs } from "file-saver";

import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm.js";

import Pagination from "../OtherComponents/Pagination.js";
import axios from "axios";
import { toast } from "react-toastify";



const GuestpostTable = ({ users, setUsers }) => {

  const navigate = useNavigate();
  // const [originalUsers, setOriginalUsers] = useState(users);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const { userData, localhosturl } = useContext(UserContext);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [filters, setFilters] = useState({
    mozDA: "",
    ahrefsDR: "",
    mozSpamScore: "",
    price: "",
    monthlyTraffic: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stripePromise, setStripePromise] = useState(null);



  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!stripePromise) {
    setStripePromise(loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY));
  }

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    setSortedField(key);
    setSortDirection(direction);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const sortedUsers = React.useMemo(() => {
    let sortedData = [...users];


    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        sortedData = sortedData.filter(
          (user) => user[key].toLowerCase() === filters[key].toLowerCase()
        );
      }
    });


    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  }, [users, sortConfig, filters]);


  const handleSort = (field) => {
    let direction = "asc";
    if (sortedField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortedField(field);
    setSortDirection(direction);
  };

  const renderSortIcon = (field) => {
    if (sortedField === field) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const filteredUsers = useMemo(() => {
    let sortedData = [...users];


    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        sortedData = sortedData.filter(
          (user) => user[key].toLowerCase() === filters[key].toLowerCase()
        );
      }
    });


    if (searchTerm.trim() !== "") {
      sortedData = sortedData.filter((user) =>
        user.categories.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    if (sortedField) {
      sortedData.sort((a, b) => {
        if (a[sortedField] < b[sortedField]) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (a[sortedField] > b[sortedField]) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedData;
  }, [users, filters, searchTerm, sortedField, sortDirection]);


  const handleBuyNow = (userId, price) => {
    navigate("/checkout", { state: { userId, price } });
  };

  const handleClearFilter = () => {
    setSearchTerm("")
    setSortedField(null);
    setSortDirection("asc");
    setSortConfig({
      key: null,
      direction: null,
    })

    setFilters({
      mozDA: "",
      ahrefsDR: "",
      mozSpamScore: "",
      price: "",
      monthlyTraffic: "",
    });
  };

  const exportDataToCSV = () => {
    const csvData = filteredUsers.map((user, index) => ({
      SNo: index + 1,
      MozDA: user.mozDA,
      Categories: user.categories,
      WebsiteLanguage: user.websiteLanguage,
      AhrefsDR: user.ahrefsDR,
      LinkType: user.linkType,
      PublisherURL: user.publisherURL,
      publisherName: user.publisherName,
      Price: user.price,
      MonthlyTraffic: user.monthlyTraffic,
      mozSpamScore: user.mozSpamScore
    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "exported_data.csv");
  };


  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        //const response = await axios.get(`/api/bookmark/${user._id}`);
        // setBookmarkedPosts(response.data.map(b => b.guestPostId));
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
      }
    };


    fetchBookmarkedPosts();
  }, []);

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        // await axios.delete('/api/bookmark/remove', { data: { userId: user._id, guestPostId: guestPost._id } });
      } else {
        // await axios.post('/api/bookmark/add', { userId: user._id, guestPostId: guestPost._id });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking guest post:', error);
    }
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
      await axios.put(`${localhosturl}/superAdmin/updateOneAdminData/${influencer._id}`, {
        isBookmarked: updatedBookmarkStatus,
      });
      if (updatedBookmarkStatus) {
        toast.success("Added to Bookmarks!");
      } else {
        toast.success("Removed from Bookmarks!");
      }


      setUsers(prev =>
        prev.map(i => i._id === influencer._id ? { ...i, isBookmarked: updatedBookmarkStatus } : i)
      );
    } catch (error) {
      console.error('Error updating bookmark status', error);
    }
  };


  return (
    <div className="p-2">
      <div className="flex items-center mb-4">

      </div>
      <div className="table-container">
        <div className="flex flex-col items-center md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
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

        <div className='overflow-x-auto  p-2 rounded-lg shadow-md'>
          <table className="min-w-full  border border-gray-300">
            <thead>

              <tr className="bg-200  uppercase text-sm leading-normal border">
                <th className="border py-3 px-2 md:px-6 text-left">S.No.</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("mozDA")}>mozDA {renderSortIcon("mozDA")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("categories")}>Categories {renderSortIcon("categories")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("websiteLanguage")}>Website Language {renderSortIcon("websiteLanguage")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("ahrefsDR")}>ahrefDR {renderSortIcon("ahrefsDR")}</th>


                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("linkType")}>Link Type {renderSortIcon("linkType")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("publisherURL")}>Publisher URL {renderSortIcon("publisherURL")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("publisherName")}>Publisher Name {renderSortIcon("publisherName")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("price")}>Price {renderSortIcon("price")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("monthlyTraffic")}>Monthly Traffic {renderSortIcon("monthlyTraffic")}</th>
                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("mozSpamScore")}>mozSpamScore {renderSortIcon("mozSpamScore")}</th>

                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>
                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Bookmark</th>
                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Profile</th>

              </tr>
            </thead>
            <tbody className=" text-sm font-light">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className={`py-3 px-6 text-center text-lg font-semibold`}
                  >
                    No Data Fetched
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border border-gray-200 hover:bg-gray-600 "
                  >
                    <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {index + 1}
                    </td>
                    <td className="border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.mozDA}
                    </td>
                    <td className="border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.categories}
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.websiteLanguage}
                    </td>
                    <td className="border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.ahrefsDR}
                    </td>


                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.linkType}
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.publisherURL}
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.publisherName}
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      ₹ {user.price}
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.monthlyTraffic}
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      {user.mozSpamScore}
                    </td>

                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      <ApplyForm section="Guestpost" publisher={user} />
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">

                      <button
                        disabled={!userData.permissions.guestPost.bookmark}
                        title={!userData.permissions.guestPost.bookmark
                          ? "You are not allowed to access this feature" : undefined
                          // : ""
                        }
                        onClick={() => handleToggleBookmark(user)}
                        className={`text-gray-600 focus:outline-none transition-transform transform hover:-translate-y-1 ${user?.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                      >
                        <FaBookmark />

                      </button>
                    </td>
                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                      <Link
                        disabled={!userData.permissions.guestPost.profile}
                        title={!userData.permissions.guestPost.profile
                          ? "You are not allowed to access this feature" : undefined

                        }
                        to={`/guestpostProfile/${user._id}`}
                        className="btn-dis  border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1 hover:animate-submitColorChange"
                      >
                        View Profile
                      </Link>
                    </td>

                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">


                    </td>
                  </tr>
                ))
              )}
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
    </div>
  );
};

export default GuestpostTable;
