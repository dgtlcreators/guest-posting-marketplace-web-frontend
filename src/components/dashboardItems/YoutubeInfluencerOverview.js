import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';


const YoutubeInfluencerOverview = () => {
  const { isDarkTheme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData ,localhosturl} = useContext(UserContext);


  const [influencerCount, setInfluencerCount] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [averageEngagementRate, setAverageEngagementRate] = useState(0);

  
  const chartSpark1Ref = useRef(null);
  const chartSpark2Ref = useRef(null);
  const chartSpark3Ref = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`);
        const fetchedData = response.data.data;

        setData(fetchedData);
        setInfluencerCount(fetchedData.length);

      
      
        const followersTotal = fetchedData.reduce((acc, item) => acc + (item.followersCount || 0), 0);
        setTotalFollowers(followersTotal);


        const engagementRateTotal = fetchedData.reduce((acc, item) => acc + (item.engagementRate || 0), 0);
        setAverageEngagementRate(fetchedData.length ? (engagementRateTotal / fetchedData.length) : 0);

        setLoading(false);

  
        initializeCharts(fetchedData, followersTotal, engagementRateTotal / fetchedData.length);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) {
      initializeCharts(data, totalFollowers, averageEngagementRate);
    }
  }, [isDarkTheme, data, totalFollowers, averageEngagementRate]);

  const initializeCharts = (fetchedData, followersTotal, avgEngagementRate) => {
    const textColor = isDarkTheme ? '#FFFFFF' : '#000000';
    const sparklineData = fetchedData.map(item => item.engagementRate || 0);

    if (chartSpark1Ref.current) {
      chartSpark1Ref.current.innerHTML = '';
    }
    if (chartSpark2Ref.current) {
      chartSpark2Ref.current.innerHTML = '';
    }
    if (chartSpark3Ref.current) {
      chartSpark3Ref.current.innerHTML = '';
    }


    var optionsSpark1 = {
      series: [{
        data: sparklineData
      }],
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#00E396'],
      title: {
        text: `${followersTotal}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: textColor 
        }
      },
      subtitle: {
        text: 'Total Followers',
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: textColor 
        }
      }
    };

    if (chartSpark1Ref.current) {
      new ApexCharts(chartSpark1Ref.current, optionsSpark1).render();
    }

    var optionsSpark2 = {
      series: [{
        data: sparklineData
      }],
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#FEB019'],
      title: {
        text: `${avgEngagementRate.toFixed(2)}%`,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: textColor 
        }
      },
      subtitle: {
        text: 'Avg Engagement Rate',
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: textColor 
        }
      }
    };

    if (chartSpark2Ref.current) {
      new ApexCharts(chartSpark2Ref.current, optionsSpark2).render();
    }
    console.log()

    var optionsSpark3 = {
      series: [{
        data: sparklineData
      }],
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#FF4560'],
      title: {
        text: `${fetchedData.length}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: textColor 
        }
      },
      subtitle: {
        text: 'Total Influencers',
        offsetX: 0,
        style: {
          fontSize: '14px',
             color: textColor 
        }
      }
    };

    if (chartSpark3Ref.current) {
      new ApexCharts(chartSpark3Ref.current, optionsSpark3).render();
    }
  };

  if (loading) {
   // return <div>Loading...</div>;
  }

  if (error) {
    //return <div>Error: {error.message}</div>;
  }

  return (
     <div className="p-4 shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-4 p-2">Youtube Influencer Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md rounded-lg" ref={chartSpark3Ref}>
        <h3 className="text-lg font-semibold bg-transparent">Total Youtube Influencers</h3>
        <p className="text-2xl">{influencerCount}</p>
        </div>
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md rounded-lg" ref={chartSpark1Ref}>
        <h3 className="text-lg font-semibold bg-transparent">Total Followers</h3>
        <p className="text-2xl">{totalFollowers}</p>
        
        </div>
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md rounded-lg" ref={chartSpark2Ref}>
        <h3 className="text-lg font-semibold bg-transparent">Avg Engagement Rate</h3>
        <p className="text-2xl">{averageEngagementRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default YoutubeInfluencerOverview;
