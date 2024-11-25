import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Linecharts from './Charts/Linecharts.js';
import BarCharts from './Charts/BarCharts.js';
import RadialBarCharts from './Charts/RadialBarCharts.js';
import FullChart from './Charts/FullChart.js';
import BarLineChart from './Charts/BarLineChart.js';
import GaugeChart from './Charts/GaugeChart.js';
import MapChart from './Charts/MapChart.js';
import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';




const InstagramInfluencerAnalytics = () => {
  const { isDarkTheme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData ,localhosturl} = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
         const response = await axios.get(`${localhosturl}/instagraminfluencers/getAllInstagraminfluencer`);
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
   // return <div>Loading...</div>;
  }

  if (error) {
    //return <div>Error: {error.message}</div>;
  }
  return (
    <div className="mt-1 p-4  shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-2 p-2">Instagram Influencer Analytics</h3>
     
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
     {/* <div className="chart-item flex-1 min-w-[300px]">
        <FullChart data={data} />
      </div>*/}
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
