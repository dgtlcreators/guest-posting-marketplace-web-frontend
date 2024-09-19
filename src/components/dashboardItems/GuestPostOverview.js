import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';


const GuestPostOverview = () => {
  const { isDarkTheme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData ,localhosturl} = useContext(UserContext);

  const chartSpark1Ref = useRef(null);
  const chartSpark2Ref = useRef(null);
  const chartSpark3Ref = useRef(null);

  // State to hold the counts
  const [publisherCount, setPublisherCount] = useState(0);
  const [totalMonthlyTraffic, setTotalMonthlyTraffic] = useState(0);
  const [distinctCategories, setDistinctCategories] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get(`${localhosturl}/form/getData`);
        const fetchedData = response.data.data;

        setData(fetchedData);

        setPublisherCount(fetchedData.length);
        
        const trafficTotal = fetchedData.reduce((acc, item) => {
          const match = item.monthlyTraffic.match(/\d+/);
          return acc + (match ? parseInt(match[0], 10) : 0);
        }, 0);
        setTotalMonthlyTraffic(trafficTotal);

        const categories = new Set(fetchedData.flatMap(item => item.categories || []));
        setDistinctCategories(categories);

        setLoading(false);
        initializeCharts(fetchedData, trafficTotal, categories.size, fetchedData.length);
        console.log("GuestPostOverview fetchedData, totalMonthlyTraffic, categoriesCount, publisherCount ",fetchedData.length, totalMonthlyTraffic, categories.size, publisherCount)
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initializeCharts = (fetchedData, totalMonthlyTraffic, categoriesCount, publisherCount) => {
    console.log("GuestPostOverview fetchedData, totalMonthlyTraffic, categoriesCount, publisherCount ",fetchedData.length, totalMonthlyTraffic, categoriesCount, publisherCount)
    const sparklineData = fetchedData.map(item => {
      const match = item.monthlyTraffic.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });

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
        curve: 'smooth'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#00E396'],
      title: {
        text: `${totalMonthlyTraffic}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
        }
      },
      subtitle: {
        text: 'Total Monthly Traffic',
        offsetX: 0,
        style: {
          fontSize: '14px',
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
        curve: 'smooth'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#FEB019'],
      title: {
        text: `${categoriesCount}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
        }
      },
      subtitle: {
        text: 'Distinct Categories',
        offsetX: 0,
        style: {
          fontSize: '14px',
        }
      }
    };

    if (chartSpark2Ref.current) {
      new ApexCharts(chartSpark2Ref.current, optionsSpark2).render();
    }

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
        curve: 'smooth'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#FF4560'],
      title: {
        text: `${publisherCount}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
        }
      },
      subtitle: {
        text: 'Total Publishers',
        offsetX: 0,
        style: {
          fontSize: '14px',
        }
      }
    };

    if (chartSpark3Ref.current) {
      new ApexCharts(chartSpark3Ref.current, optionsSpark3).render();
    }
  };

  if (loading) {
    //return <div>Loading...</div>;
  }

  if (error) {
    //return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4  shadow-md rounded-lg mb-2">
      <h1 className="text-xl font-bold mb-4 p-2">Guest Post Overview</h1>
      
      {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold">Total Publishers</h3>
          <p className="text-2xl">{publisherCount}</p>
        </div>

        <div className="p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold">Distinct Categories</h3>
          <p className="text-2xl">{distinctCategories.size}</p>
        </div>

        <div className="p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold">Total Monthly Traffic</h3>
          <p className="text-2xl">{totalMonthlyTraffic}</p>
        </div>
      </div>*/}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg flex flex-col items-center  shadow-md rounded-lg" ref={chartSpark3Ref}>
      <h3 className="text-lg font-semibold bg-transparent">Total Publishers</h3>
      <p className="text-2xl">{publisherCount}</p>
      </div>
        <div className="p-4 rounded-lg flex flex-col items-center  shadow-md rounded-lg" ref={chartSpark1Ref}>
        <h3 className="text-lg font-semibold bg-transparent">Total Monthly Traffic</h3>
        <p className="text-2xl">{totalMonthlyTraffic}</p>
        </div>
        <div className="p-4 rounded-lg flex flex-col items-center r shadow-md rounded-lg" ref={chartSpark2Ref}>
       
        <h3 className="text-lg font-semibold bg-transparent">Distinct Categories</h3>
        <p className="text-2xl">{distinctCategories.size}</p>
        </div>
       
      </div>
    </div>
  );
};

export default GuestPostOverview;
