import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import axios from 'axios';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import Pagination from "../OtherComponents/Pagination";
import { toast } from 'react-toastify';


const SuperAdminTable = ({users,setUsers}) => {
    const { isDarkTheme } = useTheme();
    const { userData, localhosturl } = useContext(UserContext);
    const userId = userData?._id;
   // const [users, setUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState(users)//useState([]);
    const navigate = useNavigate();

    

    const [sortedField, setSortedField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

/**useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${localhosturl}/user/getAllUser`)
                console.log(response.data.users)
                setUsers(response.data.users)
                setOriginalUsers(response.data.users)
            } catch (error) {
                console.error("Error fetching Users", error);
            }
        }

        fetchUsers();

    }, []);
 */
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

        setSortedField(null);
        setSortDirection("asc");
        setUsers(originalUsers)
    };

    const createDescriptionElements = (formData, users) => {
        const formatValue = (value) => {
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value, null, 2); // Pretty-print object
            }
            return value;
        };

        const elements = [
            { key: 'Name', value: formData.name },
            { key: 'Email', value: formData.email },
            { key: 'Role', value: formData.role },
            { key: 'Bio', value: formData.bio },
            { key: 'Permissions (Instagram)', value: formatValue(formData?.permissions?.instagram) },
            { key: 'Permissions (YouTube)', value: formatValue(formData?.permissions?.youtube) },
            { key: 'Permissions (ContentWriter)', value: formatValue(formData?.permissions?.contentWriter) },
            { key: 'Permissions (GuestPost)', value: formatValue(formData?.permissions?.guestPost) },
            { key: 'Total Results', value: users?.length }
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

        return `You delete a User with ${shortElements.join(' and ')} successfully.`;
    };
    const pastactivitiesAdd = async (users) => {
        
        const formData = {}
        const description = createDescriptionElements(formData, users);
        const shortDescription = generateShortDescription(formData, users);

        try {
            const activityData = {
                userId: userData?._id,
                action: "Deleted a User",
                section: "User",
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


    const deleteUser = async (id) => {
        try {
            const user = users.find((user) => user._id === id);
            if (!user) {
                toast.error("User not found");
                return;
            }
    
            // Check for existence of user permissions before processing activities
            if (!user.permissions || !user.permissions.instagram) {
                console.error("User permissions or Instagram permissions not available");
            } else {
                // Perform past activities if user permissions are valid
                await pastactivitiesAdd(user);
            }
            await axios.delete(`${localhosturl}/user/deleteUser/${id}`);
            setUsers(users.filter((influencer) => influencer._id !== id));
           
       
           
            toast.success("User Deleted Successfully");
            
        } catch (error) {
            toast.error("Error deleting User");
            console.error("Error deleting User:", error);
        }
    }



    const handleViewProfile = (user) => {
        navigate(`/userprofile/${user._id}`);
    };

    const filteredUsers = users

    const exportDataToCSV = () => {

        const formatPermissions = (permissions) => {
            return `Instagram: ${permissions.instagram ? 'Yes' : 'No'}, ` +
                `YouTube: ${permissions.youtube ? 'Yes' : 'No'}, ` +
                `ContentWriter: ${permissions.contentWriter ? 'Yes' : 'No'}, ` +
                `GuestPost: ${permissions.guestPost ? 'Yes' : 'No'}`;
        };

        const csvData = filteredUsers.map((user, index) => ({
            SNo: index + 1,
            Name: user.name,
            Email: user.email,
            Password: user.password,
            Role: user.role,
            Permissions: formatPermissions(user.permissions)


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





    return (
        <div className="table-container">

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
                    {/*<button
                        onClick={exportDataToCSV}
                        className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Export Data
                    </button>*/}
                </div>
            </div>
            <div className="overflow-x-auto  p-4 rounded-lg shadow-md">
                <table className="min-w-full  text-sm">
                    <thead>
                        <tr className=" text-base"//bg-gradient-to-r from-purple-500 to-pink-500 text-white
                        >
                            <th className="border px-4 py-2" >S.No </th>
                            <th className="border px-4 py-2" onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("password")}>Password {renderSortIcon("password")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("role")}>Role {renderSortIcon("role")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("permissions.guestPost")}>Permissions (GuestPost) {renderSortIcon("permissions.guestPost")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("permissions.instagram")}>Permissions (Instagram) {renderSortIcon("permissions.instagram")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("permissions.youtube")}>Permissions (Youtube) {renderSortIcon("permissions.youtube")}</th>
                            <th className="border px-4 py-2" onClick={() => handleSort("permissions.contentWriter")}>Permissions (ContentWriter) {renderSortIcon("permissions.contentWriter")}</th>

                            <th className="border py-3 px-2 md:px-6 text-left uppercase ">CreatedAt</th>
                            <th className="border py-3 px-2 md:px-6 text-left uppercase ">Actions</th>
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
                            paginatedUsers.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-100 transition-colors">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{user.name}</td>
                                    <td className="border px-4 py-2">{user.email}</td>
                                    <td className="border px-4 py-2">{user.password}</td>
                                    <td className="border px-4 py-2">{user.role}</td>
                                    <td className="border px-4 py-2">{user?.permissions?.guestPost ? <div>
                                       
                                        <div><strong>Add: </strong>{user?.permissions?.guestPost?.add==true?"True":"False"}</div>
                                        <div><strong>Edit: </strong>{user?.permissions?.guestPost?.edit==true?"True":"False"}</div>
                                        <div><strong>Delete: </strong>{user?.permissions?.guestPost?.delete==true?"True":"False"}</div>
                                    </div> : (
                                        'N/A'
                                    )}</td>
                                    <td className="border px-4 py-2">{user?.permissions?.instagram ? <div>
                                        <div><strong>Add: </strong>{user?.permissions?.instagram?.add==true?"True":"False"}</div>
                                        <div><strong>Edit: </strong>{user?.permissions?.instagram?.edit==true?"True":"False"}</div>
                                        <div><strong>Delete: </strong>{user?.permissions?.instagram?.delete==true?"True":"False"}</div>
                                    </div> : (
                                        'N/A'
                                    )}</td>
                                    <td className="border px-4 py-2">{user?.permissions?.youtube ? <div>
                                        <div><strong>Add: </strong>{user?.permissions?.youtube?.add==true?"True":"False"}</div>
                                        <div><strong>Edit: </strong>{user?.permissions?.youtube?.edit==true?"True":"False"}</div>
                                        <div><strong>Delete: </strong>{user?.permissions?.youtube?.delete==true?"True":"False"}</div>
                                    </div> : (
                                        'N/A'
                                    )}</td>
                                    <td className="border px-4 py-2">{user?.permissions?.contentWriter ? <div>
                                        <div><strong>Add: </strong>{user?.permissions?.contentWriter?.add==true?"True":"False"}</div>
                                        <div><strong>Edit: </strong>{user?.permissions?.contentWriter?.edit==true?"True":"False"}</div>
                                        <div><strong>Delete: </strong>{user?.permissions?.contentWriter?.delete==true?"True":"False"}</div>
                                    </div> : (
                                        'N/A'
                                    )}</td>
                                    
                                    <td className="border px-4 py-2">{user.createdAt}</td>
                                    <td className="border py-3 px-4">
                                        <Link
                                            to={`/editsuperadmin/${user._id}`}
                                            className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                                        >
                                            EDIT
                                        </Link>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1"
                                        >
                                            DELETE
                                        </button>
                                    </td>
                                     <td  className="border py-3 px-4">
                                     <Link
                      to={`/superadminProfile/${user._id}`}
                      className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                    >
                      View Profile
                    </Link>
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
    )
}

export default SuperAdminTable