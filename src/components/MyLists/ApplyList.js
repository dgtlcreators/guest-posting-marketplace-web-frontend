import React, { useEffect, useState, useMemo, useContext } from 'react'
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import ApplyForm from "../OtherComponents/ApplyForm.js";
import Bookmark from "../OtherComponents/Bookmark.js";
import Pagination from "../OtherComponents/Pagination.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext.js';
import { useTheme } from '@emotion/react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

const ApplyList = () => {
    const [applyList, setApplyList] = useState([])

    const { isDarkTheme } = useTheme();
    const navigate = useNavigate();
    const [originalUsers, setOriginalUsers] = useState(applyList);
    const [sortedField, setSortedField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const { userData, localhosturl } = useContext(UserContext);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });

    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        const fetchData=async()=>{
            try {

               const response= await axios.get(`${localhosturl}/applyroute/applyAllData`);
             
               const filteredData=response.data.filter(each=>each.userId===userData._id)
               console.log(filteredData)
               setApplyList(filteredData)
              //  toast.success("Successfully ");
               // setFormData(initialFormData);
                setRefreshKey((prevKey) => prevKey + 1);
            } catch (error) {
                toast.error(error.message);
                console.error("Error on getting apply list: ", error);
            }
        }
fetchData()
    }, [])


    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredUsers = applyList


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

    const handleClearFilter = () => {

        setSortedField(null);
        setSortDirection("asc");
        setSortConfig({
            key: null,
            direction: null,
        })

        //   setApplyList()
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

    const handleClickEditLink=(id)=>{
        navigate(`/editapplydata/${id}`)
    }


    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete( `${localhosturl}/applyroute/deleteapplydata/${userId}`);
            const user =applyList.find((user) => user._id === userId);
            //await pastactivitiesAdd(user);
            toast.success("Apply Deleted Successfully");
            setApplyList(applyList.filter((user) => user._id !== userId));
        } catch (error) {
            toast.error("Error deleting apply list");
            console.error("Error deleting apply list:", error);
        }
    };

    return (
        <div className='p-4'>
            <h4 className="text-2xl  p-2 my-2"//text-white bg-blue-700
            >Apply List</h4>
            <div>
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
                            {/*<button
                                onClick={exportDataToCSV}
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Export Data
                            </button>*/}
                        </div>
                    </div>

                    <div className='overflow-x-auto  p-2 rounded-lg shadow-md'>
                        <table className="min-w-full  border border-gray-300">
                            <thead>
                                <th className="border py-3 px-2 md:px-6 text-left">S.No.</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("phone")}>Phone {renderSortIcon("phone")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("section")}>Section {renderSortIcon("section")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("status")}>Status {renderSortIcon("status")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("createdAt")}>CreatedAt {renderSortIcon("createdAt")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Action</th>
                            </thead>
                            <tbody className=" text-sm font-light">
                                {paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="py-3 px-6 text-center text-lg font-semibold">No Data Fetched</td>
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
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                                {user.name}
                                            </td>
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                                {user.email}
                                            </td>
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                                {user.phone}
                                            </td>
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                                {user.section}
                                            </td>
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                                {user.status}
                                            </td>
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                                {user.createdAt}
                                            </td>
                                            <td className=" border  py-3 px-2 md:px-6 text-center text-md font-semibold">
                                            {/*<button disabled={!userData.permissions.guestPost.edit}
                                            title={!userData.permissions.guestPost.edit
                                                ? "You are not allowed to access this feature"
                                                : undefined  // : ""
                                            }
                                            onClick={()=>handleClickEditLink(user._id)}
                                           // to={`/editguestpostdata/${user._id}`}
                                            className="btn-dis border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
                                        >
                                            EDIT
                                        </button>*/}
                                        <button disabled={!userData.permissions.guestPost.delete}
                                            title={!userData.permissions.guestPost.delete
                                                ? "You are not allowed to access this feature"
                                                : undefined   // : ""
                                            }
                                            onClick={() => deleteUser(user._id)}
                                            className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1"
                                        >
                                            DELETE
                                        </button>
                                            </td>
                                        </tr>)))}
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
        </div>
    )
}

export default ApplyList