import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Linecharts from './Charts/Linecharts.js';
import RadarChart3 from './Charts/RadarChart3.js';
import Treemap from "./Charts/Treemap.js"
import SankeyDiagram from './Charts/SankeyDiagram.js';
//import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';




const ContentWriterAnalytics = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { localhosturl} = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
         const response = await axios.get(`${localhosturl}/contentwriters/getallcontentwriters`);
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
    //return <div>Loading...</div>;
  }

  if (error) {
    //return <div>Error: {error.message}</div>;
  }
  return (
    <div className="mt-1 p-4  shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-2 p-2">Content Writer Analytics</h3>

      <div className="chart-container flex flex-wrap gap-4">
      <div className="chart-item flex-1 min-w-[300px]">
        <Linecharts data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <RadarChart3 data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <SankeyDiagram data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <Treemap data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        
      </div>
      <div className="chart-item flex-1 min-w-[300px]"></div>
      </div>
     
   
    
    </div>
  );
};

export default ContentWriterAnalytics;
