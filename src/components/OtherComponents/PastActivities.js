

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { UserContext } from '../../context/userContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faSort,
  faSpinner,
  faCalendarAlt,
  faFilter,
  faCheckSquare,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../context/ThemeProvider.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PastActivities = () => {
  const { isDarkTheme } = useTheme();
  const { userData, localhosturl } = useContext(UserContext);
  const userId = userData?._id;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    sections: [],
    types: [],
    sortOrder: 'newest',
    timeFrame: 'All',
  });

  useEffect(() => {
    const fetchPastActivities = async () => {
      setLoading(true);
      try {


        const response = await axios.get(`${localhosturl}/pastactivities/getAllpastactivities`, {
          params: {
            userId,
            sections: filter.sections.length > 0 ? filter.sections : undefined,
            types: filter.types.length > 0 ? filter.types : undefined,
            sortOrder: filter.sortOrder,
            timeFrame: filter.timeFrame !== 'All' ? filter.timeFrame : undefined,
          },
        });
        setActivities(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPastActivities();
  }, [filter, userId]);

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFilter((prevState) => ({
        ...prevState,
        [name]: [...prevState[name], value],
      }));
    } else {
      setFilter((prevState) => ({
        ...prevState,
        [name]: prevState[name].filter((item) => item !== value),
      }));
    }
  };

  const handleSortChange = (e) => {
    setFilter({
      ...filter,
      sortOrder: e.target.value,
    });
  };

  const handleTimeFrameChange = (e) => {
    setFilter({
      ...filter,
      timeFrame: e.target.value,
    });
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    if (userId) {
      filtered = filtered.filter((activity) => activity.userId === userId);
    }

    if (filter.sections.length > 0) {
      filtered = filtered.filter((activity) => filter.sections.includes(activity.section));
    }

    if (filter.types.length > 0) {
      filtered = filtered.filter((activity) => filter.types.includes(activity.details.type));
    }

    if (filter.timeFrame !== 'All') {
      const now = new Date();
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.timestamp);
        switch (filter.timeFrame) {
          case 'Today':
            return activityDate.toDateString() === now.toDateString();
          case 'Yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return activityDate.toDateString() === yesterday.toDateString();
          case 'This Week':
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return activityDate >= weekAgo && activityDate <= now;
          case 'This Month':
            return (
              activityDate.getFullYear() === now.getFullYear() &&
              activityDate.getMonth() === now.getMonth()
            );
          default:
            return true;
        }
      });
    }

    return filtered;
  };
  const handleClearFilters = () => {
    setFilter({
      sections: [],
      types: [],
      sortOrder: 'newest',
      timeFrame: 'All',
    });
  };

  const sortedActivities = getFilteredActivities().sort((a, b) => {
    return filter.sortOrder === 'newest'
      ? new Date(b.timestamp) - new Date(a.timestamp)
      : new Date(a.timestamp) - new Date(b.timestamp);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 animate-spin">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-500" /> Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500 animate-pulse">Error: {error}</div>;
  }

  const deletePastActivity = async (id) => {
    try {

      await axios.delete(`${localhosturl}/pastactivities/deletePastActivities/${id}`);
      toast.success("Past Activity  Deleted Successfully");
      const user = activities.find((user) => user._id === id);

      //await pastactivitiesAdd(user);
      //pastactivitiesAdd()
      setActivities(activities.filter((writer) => writer._id !== id));
    } catch (error) {
      toast.error("Error deleting Content Writer");
      console.error("Error deleting Content Writer:", error);
    }
  };

  const handleClearAll = async() => {
   // handleClearFilters();
   // sortedActivities.map(each=>deletePastActivity(each._id))
   // setActivities([]);
    try {
      
      const deletePromises = sortedActivities.map(activity => 
        axios.delete(`${localhosturl}/pastactivities/deletePastActivities/${activity._id}`)
      );
  
      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
      setActivities([]); 
      toast.success("All past activities deleted successfully.");
    } catch (error) {
      toast.error("Error deleting past activities.");
      console.error("Error deleting past activities:", error);
    }
  };

  return (
    <div className={`container mx-auto p-4 `}>
      <h2 className="text-2xl   p-2 my-2">Past Activities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">

        <div className="flex flex-col">
          <label className="font-medium mb-2">Section:</label>
          {['Instagram Influencer', 'YouTube Influencer', 'Content Writer', 'Guest Post', 'Apply', 'Super Admin'].map((section) => (
            <div key={section} className="flex items-center mb-2">
              <input
                type="checkbox"
                name="sections"
                value={section}
                checked={filter.sections.includes(section)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span>{section}</span>
            </div>
          ))}
        </div>


        <div className="flex flex-col">
          <label className="font-medium mb-2">Type:</label>
          {['filter', 'create', 'delete', 'update', 'view'].map((type) => (
            <div key={type} className="flex items-center mb-2">
              <input
                type="checkbox"
                name="types"
                value={type}
                checked={filter.types.includes(type)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span>{type}</span>
            </div>
          ))}
        </div>


        <div className="flex flex-col">
          <label htmlFor="sortOrder" className="font-medium mb-2">Sort Order:</label>
          <select
            name="sortOrder"
            id="sortOrder"
            value={filter.sortOrder}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
          </select>
        </div>


        <div className="flex flex-col">
          <label htmlFor="timeFrame" className="font-medium mb-2">Time Frame:</label>
          <select
            name="timeFrame"
            id="timeFrame"
            value={filter.timeFrame}
            onChange={handleTimeFrameChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleClearFilters}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>Clear Filters</span>
        </button>
        <button
          onClick={handleClearAll}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2 ml-2 mr-2"
        >
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>Clear All</span>
        </button>
      </div>

      <h3 className="text-2xl   p-2 my-2">Past Activities List</h3>
      <div className="grid grid-cols-1 gap-6">
        {sortedActivities.length===0?<p className='py-3 px-6 text-center text-lg font-semibold'>No Data Found</p>:sortedActivities.map((activity) => (
          <div key={activity._id} className={`shadow-lg rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 `} //${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}
          >
            
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-2xl animate-pulse" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold p-2">{activity.user.name}</h3>
                <p>Action: {activity.action}</p>
                <p>Section: {activity.section}</p>
                <p>{activity.details.shortDescription}</p>
                <span className="text-gray-500 text-sm">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
              { /*<div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCheckSquare} className="text-green-500" />
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
            </div>*/}
            <div className="flex items-center space-x-2">
            <button onClick={() => deletePastActivity(activity._id)}
                className="  text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" /></button>
           
            </div>
          
            {/*<div className="flex items-center justify-end space-x-2 mt-3">

              {/*<Link
                to={`/editpastActivity/${activity._id}`}
                className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-decoration-none inline-block shadow-lg transition-transform transform hover:-translate-y-1"
              >
                EDIT
              </Link>/}
              <button onClick={() => deletePastActivity(activity._id)}
                className="border bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded my-2 transition-transform transform hover:-translate-y-1">
                DELETE</button>
            </div>*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastActivities;

