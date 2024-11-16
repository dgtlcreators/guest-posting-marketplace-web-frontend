


import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const FunnelCharts = ({ data }) => {
  const { isDarkTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('allLanguage');

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const languageCounts = data.reduce((acc, item) => {
    if (selectedLanguage === 'allLanguage' || item.websiteLanguage === selectedLanguage) {
      acc[item.websiteLanguage] = (acc[item.websiteLanguage] || 0) + 1;
    }
    return acc;
  }, {});


  const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

  const categories = sortedLanguages.map(([language]) => language);
  const seriesData = sortedLanguages.map(([, count]) => count);

  const series = [{
    name: "Language Count",
    data: seriesData,
  }];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ': ' + val;
      },
      dropShadow: {
        enabled: true,
      },
    },
    title: {
      text: 'Website Language Distribution',
     
      align: 'left',
      style: {
       
        color: isDarkTheme ? '#FFFFFF' : '#000000', 
      },
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
      theme: isDarkTheme ? 'dark' : 'light', 
      x: {
        show: false, 
      },
      y: {
        formatter: (value) => `Count: ${value}`,
      },
      marker: {
        show: false, 
      },
      fillSeriesColor: true, 
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    
        const label = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="padding: 8px 12px; background-color: ${isDarkTheme ? '#333' : '#fff'}; color: ${isDarkTheme ? '#fff' : '#333'}; border-radius: 4px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
            <strong>${label}</strong><br>
            Count: ${value}
          </div>
        `;
      },
    },
  };

  return (
    <div className='w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar'>
      <div className="flex flex-col">
        <label htmlFor="websiteLanguage">Website Language</label>
        <select
          id="websiteLanguage"
          name="websiteLanguage"
          value={selectedLanguage}
          onChange={handleChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="allLanguage">All</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Marathi">Marathi</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Urdu">Urdu</option>
          <option value="Odia">Odia</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Bengali">Bengali</option>
          <option value="Kannada">Kannada</option>
        </select>
      </div>
      <div id="chart" >
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default FunnelCharts;
