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
import GuestpostTable from '../GuestPosts/GuestpostTable.js';
import InstagramInfluencerTable from '../InstgramInfluencer/InstagramInfluencerTable.js';
import YoutubeInfluencerTable from '../YoutubeInfluencer/YoutubeInfluencerTable.js';
import ContentWriterTable from '../ContentWriter/ContentWriterTable.js';

const BookmarkedList = () => {
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

             //  const response= await axios.get(`${localhosturl}/admin/createAdminData`);
               //console.log(response.data)
              // setApplyList(response.data)
               // toast.success("Successfully Created");
               // setFormData(initialFormData);
                setRefreshKey((prevKey) => prevKey + 1);
            } catch (error) {
                toast.error(error.message);
                console.error("Error on bookmarked list: ", error);
            }
        }
fetchData()
    }, [])
    //const [instagramInfluencers,setInstagramInfluencers]=useEffect([])
    //const [youtubeInfluencers,setYoutubeInfluencers]=useEffect([])
  //  const [contentWriters,setContentWriters]=useEffect([])
   // const [guestPost,setGuestPost]=useEffect([])

   /* useEffect(()=>{
        const fetchInfluencer=async()=>{
          try {
             const response = await axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`);             
            setYoutubeInfluencers(response.data.data)  
          } catch (error) {
            console.error("Error fetching influencers", error);
          }
        }
    
        fetchInfluencer()
      },[])

      useEffect(() => {
        const fetchInfluencers = async () => {
          try {   
            const response = await axios.get(`${localhosturl}/instagraminfluencers/getAllInstagraminfluencer`);   
            setInstagramInfluencers(response.data.instagramInfluencer);
          } catch (error) {
            console.error("Error fetching influencers", error);
          }
        };
    
        fetchInfluencers();
      }, []);

      useEffect(() => {
        const fetchContentWriters = async () => {
          try {    
            const response = await axios.get(`${localhosturl}/contentwriters/getallcontentwriters`);
            setContentWriters(response.data.data);         
          } catch (error) {
            console.error("Error fetching Content Writers", error);
          }
        };
    
        fetchContentWriters();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${localhosturl}/admin/getAdminData`);
                setGuestPost(response.data);
                
            } catch (error) {
                console.error("Error fetching Guest Post data:", error);
            }
        };
        fetchData();
    }, []);*/
    const [instagramInfluencers, setInstagramInfluencers] = useState([]);
    const [youtubeInfluencers, setYoutubeInfluencers] = useState([]);
    const [contentWriters, setContentWriters] = useState([]);
    const [guestPost, setGuestPost] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [youtubeResponse, instagramResponse, contentWriterResponse, guestPostResponse] = await Promise.all([
                    axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`),
                    axios.get(`${localhosturl}/instagraminfluencers/getAllInstagraminfluencer`),
                    axios.get(`${localhosturl}/contentwriters/getallcontentwriters`),
                    axios.get(`${localhosturl}/admin/getAdminData`)
                ]);
//console.log(youtubeResponse,instagramResponse,contentWriterResponse,guestPostResponse)
const youtubefilter=youtubeResponse.data.data.filter(each=>each.isBookmarked)
const instagramfilter=instagramResponse.data.instagramInfluencer.filter(each=>each.isBookmarked)
const contentWriterfilter=contentWriterResponse.data.data.filter(each=>each.isBookmarked)
const guestPostfilter=guestPostResponse.data.filter(each=>each.isBookmarked)
                setYoutubeInfluencers(youtubefilter || []);
                setInstagramInfluencers(instagramfilter || []);
                setContentWriters(contentWriterfilter|| []);
                setGuestPost(guestPostfilter || []);

               // setYoutubeInfluencers(youtubeResponse.data.data || []);
               // setInstagramInfluencers(instagramResponse.data.instagramInfluencer || []);
               // setContentWriters(contentWriterResponse.data.data || []);
               // setGuestPost(guestPostResponse.data || []);
              
            } catch (error) {
                toast.error("Failed to fetch data");
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [localhosturl]);

    //const combinedList = [
    //    ...instagramInfluencers,
    //    ...youtubeInfluencers,
   //     ...contentWriters,
   //     ...guestPost
   // ];
//console.log(combinedList)
    // filteredUsers = combinedList;

    


 const combinedList = [
    ...instagramInfluencers.map(item => ({ ...item, type: 'Instagram' })),
    ...youtubeInfluencers.map(item => ({ ...item, type: 'YouTube' })),
    ...contentWriters.map(item => ({ ...item, type: 'ContentWriter' })),
    ...guestPost.map(item => ({ ...item, type: 'GuestPost' }))
];


//console.log("combinedList ",combinedList)

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


    

    return (
        <div className='p-4'>
            <h2 className="text-2xl  p-2 my-2"//text-white bg-blue-700
            >Bookmarked List</h2>
            <div>
                <div className="table-container p-2">
                <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
            >Guestpost List</h3>
                    <GuestpostTable users={guestPost} setUsers={setGuestPost}/>
                    <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
            >Instagram Influencer List</h3>
                    <InstagramInfluencerTable influencers={instagramInfluencers} setInfluencers={setInstagramInfluencers}/>
                    <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
            >Youtube Influencer List</h3>
                    <YoutubeInfluencerTable influencers={youtubeInfluencers} setInfluencers={setYoutubeInfluencers}/>
                    <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
            >Content Writer List</h3>
                    <ContentWriterTable contentWriters={contentWriters} setContentWriters={setContentWriters}/>
                       {/* <div className="flex flex-col items-center md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
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
                           {/* <button
                                onClick={exportDataToCSV}
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Export Data
                            </button>
                        </div>
                    </div>

               { <div className='overflow-x-auto  p-2 rounded-lg shadow-md'>
                        <table className="min-w-full  border border-gray-300">
                            <thead>
                                <th className="border py-3 px-2 md:px-6 text-left">S.No.</th>
                                <th className="border py-3 px-2 md:px-6 text-left" onClick={() => handleSort("mozDA")}>mozDA {renderSortIcon("mozDA")}</th>
                                <th className="border py-3 px-2 md:px-6 text-left uppercase ">Apply</th>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
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
                                        </tr>))
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
                    />}*/}
                </div>
            </div>
        </div>
    )
}

export default BookmarkedList