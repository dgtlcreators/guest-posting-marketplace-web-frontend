
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const DistributedColumns = ({ data }) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [selectedTraffic, setSelectedTraffic] = useState('allMonthlyTraffic');

  const handleChange = (event) => {
    setSelectedTraffic(event.target.value);
  };

  // Parse and count monthly traffic
  const trafficCounts = data.reduce((acc, item) => {
    const traffic = parseInt(item.monthlyTraffic.replace(/[^0-9]/g, ''));
    if (selectedTraffic === 'allMonthlyTraffic' || traffic >= parseInt(selectedTraffic.replace(/[^0-9]/g, ''))) {
      acc[traffic] = (acc[traffic] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedTraffic = Object.entries(trafficCounts).sort((a, b) => b[1] - a[1]);

  const categories = sortedTraffic.map(([traffic]) => `>= ${traffic}`);
  const seriesData = sortedTraffic.map(([, count]) => count);

  const series = [{
    name: "Monthly Traffic",
    data: seriesData,
  }];

  const colors = ['#1E90FF', '#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#FF69B4', '#FFA500', '#DA70D6'];

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {
          // handle chart click event
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    title: {
        text: 'Monthly Traffic',
      },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      }
    }
  };

  return (
    <div className='w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar'>
      <div className="flex flex-col mb-4">
        <label htmlFor="monthlyTraffic">Monthly Traffic</label>
        <select
          id="monthlyTraffic"
          name="monthlyTraffic"
          value={selectedTraffic}
          onChange={handleChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="allMonthlyTraffic">All</option>
          <option value="1000">Monthly Traffic &gt;= 1,000</option>
          <option value="10000">Monthly Traffic &gt;= 10,000</option>
          <option value="50000">Monthly Traffic &gt;= 50,000</option>
          <option value="100000">Monthly Traffic &gt;= 100,000</option>
          <option value="200000">Monthly Traffic &gt;= 200,000</option>
          <option value="300000">Monthly Traffic &gt;= 300,000</option>
          <option value="400000">Monthly Traffic &gt;= 400,000</option>
          <option value="500000">Monthly Traffic &gt;= 500,000</option>
          <option value="600000">Monthly Traffic &gt;= 600,000</option>
          <option value="700000">Monthly Traffic &gt;= 700,000</option>
          <option value="800000">Monthly Traffic &gt;= 800,000</option>
          <option value="900000">Monthly Traffic &gt;= 900,000</option>
          <option value="1000000">Monthly Traffic &gt;= 1,000,000</option>
          <option value="10000000">Monthly Traffic &gt;= 10,000,000</option>
        </select>
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default DistributedColumns;
