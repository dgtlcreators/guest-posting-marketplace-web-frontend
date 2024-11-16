
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider.js';


const BrandUserDashboard = () => {
  const { isDarkTheme } = useTheme();
  const [savedSearches, setSavedSearches] = useState([]);
  const [bookmarkedInfluencers, setBookmarkedInfluencers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searches = await axios.get('http://localhost:5000/dashboard/savedSearches');
        const influencers = await axios.get('http://localhost:5000/dashboard/bookmarkedInfluencers');
        const activities = await axios.get('http://localhost:5000/dashboard/recentActivities');
        setSavedSearches(searches.data);
        setBookmarkedInfluencers(influencers.data);
        setRecentActivities(activities.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="space-y-6">
  
        <div>
          <h3 className="text-xl font-semibold">Saved Searches</h3>
          <ul>
            {savedSearches.map((search, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">{search}</li>
            ))}
          </ul>
        </div>
       
        <div>
          <h3 className="text-xl font-semibold">Bookmarked Influencers</h3>
          <ul>
            {bookmarkedInfluencers.map((influencer, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">{influencer.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Recent Activities</h3>
          <ul>
            {recentActivities.map((activity, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">{activity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandUserDashboard;
