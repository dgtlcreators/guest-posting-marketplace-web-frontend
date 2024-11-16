import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown, FaBookmark } from "react-icons/fa";
import { UserContext } from "../../context/userContext.js";

import { saveAs } from "file-saver";

import Papa from "papaparse";

import Pagination from "../OtherComponents/Pagination.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const NewGuestpostTable = () => {
 
    const [users, setUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [sortedField, setSortedField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const { userData, localhosturl } = useContext(UserContext);
    const navigate=useNavigate()
   


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${localhosturl}/admin/getAdminData`

                );
                setUsers(response.data);
                setOriginalUsers(response.data);
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
        setUsers(originalUsers); 
        setSortedField(null);
        setSortDirection("asc"); 
    };

    const createDescriptionElements = (formData, users) => {
        const elements = [
            { key: 'Publisher URL', value: users.publisherURL },
            { key: 'Publisher Name', value: users.publisherName },
            { key: 'Publisher Email', value: users.publisherEmail },
            { key: 'Publisher Phone No', value: users.publisherPhoneNo },
            { key: 'Moz DA', value: users.mozDA },
            { key: 'Categories', value: users.categories },
            { key: 'Website Language', value: users.websiteLanguage },
            { key: 'Ahrefs DR', value: users.ahrefsDR },
            { key: 'Link Type', value: users.linkType },
            { key: 'Price', value: users.price },
            { key: 'Monthly Traffic', value: users.monthlyTraffic },
            { key: 'Moz Spam Score', value: users.mozSpamScore },
            { key: 'Total results', value: users?.length }
        ];
        return elements
            .filter(element => element.value)
            .map(element => `${element.key}: ${element.value}`)
            .join(', ');
    };

    const generateShortDescription = (formData, users) => {

        const elements = createDescriptionElements(formData, users).split(', ');

        const shortElements = elements.slice(0, 2);

        return `You deleted a guest post ${shortElements.length > 0 ? "" : "with"} ${shortElements.join(' and ')} successfully.`;
    };

    const pastactivitiesAdd = async (users) => {
        const formData = {}
        const description = createDescriptionElements(formData, users);
        const shortDescription = generateShortDescription(formData, users);
        try {
            const activityData = {
                userId: userData?._id,
                action: "Deleted a guest post",
                section: "Guest Post",
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

    const deleteUser = async (userId) => {
        try {
             await axios.delete(

                `${localhosturl}/superAdmin/deleteOneAdminData/${userId}`

            );

            const user = users.find((user) => user._id === userId);

            await pastactivitiesAdd(user);
            toast.success("Client Deleted Successfully");
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            toast.error("Error deleting user");
            console.error("Error deleting user:", error);
        }
    };
   

    const filteredUsers = users

    const exportDataToCSV = () => {
        const csvData = filteredUsers.map((user, index) => ({
            SNo: index + 1,
            publisherName: user.publisherName,
            publisherEmail: user.publisherEmail,
            PublisherURL: user.publisherURL,
            publisherPhoneNo: user.publisherPhoneNo,
            MozDA: user.mozDA,
            Categories: user.categories,
            WebsiteLanguage: user.websiteLanguage,
            AhrefsDR: user.ahrefsDR,
            LinkType: user.linkType,


            Price: user.price,
            MonthlyTraffic: user.monthlyTraffic,
            mozSpamScore: user.mozSpamScore
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
const handleClickEditLink=(id)=>{
    navigate(`/editguestpostdata/${id}`)
}

    return (
        <div className="container mx-auto p-4">

            <div className="flex mb-3 flex-col items-center md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
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

            <div className="overflow-x-auto">
                
                <table className="min-w-full border"
                >
                    <thead>
                        <tr className="border border-b"
                        >
                            <th className="border px-4 py-2">S.No.</th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("publisherName")}
                            >
                                Publisher Name {renderSortIcon("publisherName")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("publisherEmail")}
                            >
                                Publisher Email {renderSortIcon("publisherEmail")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("publisherPhoneNo")}
                            >
                                Publisher Number {renderSortIcon("publisherPhoneNo")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("publisherURL")}
                            >
                                Publisher URL {renderSortIcon("publisherURL")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("mozDA")}
                            >
                                MozDA {renderSortIcon("mozDA")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("categories")}
                            >
                                Categories {renderSortIcon("categories")}
                            </th>

                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("websiteLanguage")}
                            >
                                Website Language {renderSortIcon("websiteLanguage")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("ahrefsDR")}
                            >
                                AhrefDR {renderSortIcon("ahrefsDR")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("linkType")}
                            >
                                Link Type {renderSortIcon("linkType")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("price")}
                            >
                                Price {renderSortIcon("price")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("monthlyTraffic")}
                            >
                                Monthly Traffic {renderSortIcon("monthlyTraffic")}
                            </th>
                            <th
                                className="border px-4 py-2 cursor-pointer"
                                onClick={() => handleSort("mozSpamScore")}
                            >
                                Moz Spam Score {renderSortIcon("mozSpamScore")}
                            </th>
                            <th className="border py-3 px-2 md:px-6 text-left uppercase ">Actions</th>
                          
                            <th className="border py-3 px-2 md:px-6 text-left uppercase ">Bookmark</th>
                            <th className="border py-3 px-2 md:px-6 text-left uppercase ">Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="10"
                                    className=""
                                >
                                    No Data Found
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user, index) => (
                                <tr key={user._id} className="border-b "
                                >
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{user.publisherName}</td>
                                    <td className="border px-4 py-2">{user.publisherEmail}</td>
                                    <td className="border px-4 py-2">{user.publisherPhoneNo}</td>
                                    <td className="border px-4 py-2">{user.publisherURL}</td>
                                    <td className="border px-4 py-2">{user.mozDA}</td>
                                    <td className="border px-4 py-2">{user.categories}</td>
                                    <td className="border px-4 py-2">{user.websiteLanguage}</td>
                                    <td className="border px-4 py-2">{user.ahrefsDR}</td>
                                    <td className="border px-4 py-2">{user.linkType}</td>
                                    <td className="border px-4 py-2">₹ {user.price}</td>
                                    <td className="border px-4 py-2">{user.monthlyTraffic}</td>
                                    <td className="border px-4 py-2">{user.mozSpamScore}</td>
                                    <td className="border py-3 px-4">
                                    <button disabled={!userData.permissions.guestPost.edit}
                                            title={!userData.permissions.guestPost.edit
                                                ? "You are not allowed to access this feature"
                                                : undefined  
                                            }
                                            onClick={()=>handleClickEditLink(user._id)}
                                       
                                            className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                                        >
                                            EDIT
                                        </button>
                                     
                                        <button disabled={!userData.permissions.guestPost.delete}
                                            title={!userData.permissions.guestPost.delete
                                                ? "You are not allowed to access this feature"
                                                : undefined  
                                            }
                                            onClick={() => deleteUser(user._id)}
                                            className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1"
                                        >
                                            DELETE
                                        </button>


                                    </td>
                               
                                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                                        <button disabled={!userData.permissions.guestPost.bookmark}
                                            title={!userData.permissions.guestPost.bookmark
                                                ? "You are not allowed to access this feature" : undefined
                                            
                                            }
                                            onClick={() => handleToggleBookmark(user)}
                                            className={`btn-dis  text-gray-600 focus:outline-none transition-transform transform hover:-translate-y-1 ${user.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                                                } ${!userData.permissions.guestPost.bookmark && 'btn-enabled'}`}
                                        >
                                            <FaBookmark />
                                        
                                        </button>
                                       
                                    </td>
                                    <td className="border py-3 px-2 md:px-6 text-center text-md font-semibold">
                                        {userData.permissions.guestPost.profile ? (
                                            <Link
                                                to={`/guestpostProfile/${user._id}`}
                                                className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                                            >
                                                View Profile
                                            </Link>
                                        ) : (
                                            <span
                                                title="You are not allowed to access this feature"
                                                className="btn-dis border bg-gray-500 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg cursor-not-allowed"
                                            >
                                                View Profile
                                            </span>
                                        )}

                                       
                                    </td>

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

export default NewGuestpostTable;
