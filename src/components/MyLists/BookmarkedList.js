import React, { useEffect, useState, useMemo, useContext } from 'react'
import { saveAs } from "file-saver";

import Papa from "papaparse";

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
    const [applyList,] = useState([])


    // const [originalUsers, setOriginalUsers] = useState(applyList);
    const [sortedField, setSortedField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const { userData, localhosturl } = useContext(UserContext);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });


    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
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
                const youtubefilter = youtubeResponse.data.data.filter(each => each.isBookmarked)
                const instagramfilter = instagramResponse.data.instagramInfluencer.filter(each => each.isBookmarked)
                const contentWriterfilter = contentWriterResponse.data.data.filter(each => each.isBookmarked)
                const guestPostfilter = guestPostResponse.data.filter(each => each.isBookmarked)
                setYoutubeInfluencers(youtubefilter || []);
                setInstagramInfluencers(instagramfilter || []);
                setContentWriters(contentWriterfilter || []);
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
                    <GuestpostTable users={guestPost} setUsers={setGuestPost} />
                    <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
                    >Instagram Influencer List</h3>
                    <InstagramInfluencerTable influencers={instagramInfluencers} setInfluencers={setInstagramInfluencers} />
                    <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
                    >Youtube Influencer List</h3>
                    <YoutubeInfluencerTable influencers={youtubeInfluencers} setInfluencers={setYoutubeInfluencers} />
                    <h3 className="text-2xl  p-2 my-2"//text-white bg-blue-700
                    >Content Writer List</h3>
                    <ContentWriterTable contentWriters={contentWriters} setContentWriters={setContentWriters} />

                </div>
            </div>
        </div>
    )
}

export default BookmarkedList