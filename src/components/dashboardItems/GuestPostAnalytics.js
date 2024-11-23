

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import PieChart from './Charts/PieChart.js';
import FunnelCharts from './Charts/FunnelCharts.js';
import DistributedColumns from './Charts/DistributedColumns.js';
import RadarChart from './Charts/RadarChart.js';
import MixedChart from './Charts/MixedChart.js';
import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';


const GuestPostAnalytics = () => {
  const { isDarkTheme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData ,localhosturl} = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${localhosturl}/form/getData`);
       
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
   // return <div>Loading...</div>;
  }

  if (error) {
   // return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mt-1 p-4  shadow-md rounded-lg">
    <h3 className="text-xl font-bold mb-4 p-2">Guest Post Analytics</h3>
    <div className="chart-container flex flex-wrap gap-4">
      <div className="chart-item flex-1 min-w-[400px]">
        <PieChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[350px] ">
        <FunnelCharts data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[350px]">
        <DistributedColumns data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[350px]">
        <RadarChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[350px]">
        <MixedChart data={data} />
      </div>
    </div>
  </div>
  );
};

export default GuestPostAnalytics;
