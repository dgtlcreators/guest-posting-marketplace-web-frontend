import React, { useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const RadarChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
  const [selectedSpamScore, setSelectedSpamScore] = useState('allMozSpamScore');

  const handleChange = (event) => {
    setSelectedSpamScore(event.target.value);
  };

  const spamScoreCounts = data.reduce((acc, item) => {
    const spamScore = item.mozSpamScore;
    if (selectedSpamScore === 'allMozSpamScore' || spamScore === selectedSpamScore) {
      acc[spamScore] = (acc[spamScore] || 0) + 1;
    }
    return acc;
  }, {});

  const categories = [
    'Spam Score <= 01',
    'Spam Score <= 02',
    'Spam Score <= 05',
    'Spam Score <= 10',
    'Spam Score <= 20',
    'Spam Score <= 30'
  ];

  const sortedTraffic = Object.entries(spamScoreCounts).sort((a, b) => b[1] - a[1]);
  const seriesData = sortedTraffic.map(([, count]) => count);

  const series = [{
    name: 'Spam Score Count',
    data: seriesData
  }];

  const colors = ['#FF6347', '#FF69B4', '#FFD700', '#32CD32', '#1E90FF', '#8A2BE2'];

  const options = {
    chart: {
      height: 350,
      type: 'radar',
    },
    title: {
      text: 'Spam Score Distribution',
      align: 'left',
      style: {
        color: isDarkTheme ? '#FFFFFF' : '#000000',
      },
    },
    colors: colors,
    series: series,
    xaxis: {
      categories: categories,
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        formatter: function(val) {
          return val;
        },
      },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#e9e9e9',
          fill: {
            colors: ['#f5f5f5', '#f5f5f5'],
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: isDarkTheme ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
      x: {
        show: true,
        formatter: function(val) {
          return val;
        },
      },
      y: {
        title: {
          formatter: function() {
            return '';
          },
        },
        formatter: function(val) {
          return `${val} Count`;
        },
      },
      marker: {
        show: true,
      },
      fillSeriesColor: true,
    },
    toolbar: {
      show: true,
      tools: {
        download: true, 
        zoom: false,   
        pan: false,   
        reset: false,   
      },
      export: {
        csv: {
          columnDelimiter: ',',
          headerCategory: 'Category',
          headerValue: 'Value',
        },
      },
    
      theme: isDarkTheme ? 'dark' : 'light', 
    },
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto p-4 rounded-lg shadow-lg calendar">
      <div className="flex flex-col mb-4">
        <label htmlFor="mozSpamScore" className={`text-${isDarkTheme ? 'white' : 'black'}`}>Moz Spam Score</label>
        <select
          id="mozSpamScore"
          name="mozSpamScore"
          value={selectedSpamScore}
          onChange={handleChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="allMozSpamScore">All</option>
          <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
          <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
          <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
          <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
          <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
          <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
        </select>
      </div>

      <ApexCharts
        options={options}
        series={series}
        type="radar"
        height={options.chart.height}
      />
    </div>
  );
};

export default RadarChart;
