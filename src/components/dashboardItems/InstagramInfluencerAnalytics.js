import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Linecharts from './Charts/Linecharts';
import BarCharts from './Charts/BarCharts';
import RadialBarCharts from './Charts/RadialBarCharts';
import FullChart from './Charts/FullChart.js';
import BarLineChart from './Charts/BarLineChart.js';
import GaugeChart from './Charts/GaugeChart.js';
import MapChart from './Charts/MapChart.js';



const InstagramInfluencerAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://guest-posting-marketplace-web-backend.onrender.com/instagraminfluencers/getAllInstagraminfluencer');
        // const response = await axios.get('http://localhost:5000/instagraminfluencers/getAllInstagraminfluencer');
        setData(response.data.instagramInfluencer);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="mt-1 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Instagram Influencer Analytics</h2>
     
      <div className="chart-container flex flex-wrap gap-4">
      <div className="chart-item flex-1 min-w-[300px]">
      <Linecharts data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
      <BarCharts data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <RadialBarCharts data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <FullChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <BarLineChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <GaugeChart data={data} />
      </div>
     { /*<div className="chart-item flex-1 min-w-[300px]">
        <MapChart data={data} />
      </div>*/}
    
    
    
    </div>
   
    
    </div>
  );
};

export default InstagramInfluencerAnalytics;
