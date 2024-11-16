
import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const BarLineChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
  const languageCounts = {};

  data.forEach(item => {
    if (item.language) {
      languageCounts[item.language] = (languageCounts[item.language] || 0) + 1;
    }
  });

  const languageLabels = Object.keys(languageCounts);
  const languageSeries = [{
    name: 'Languages',
    data: Object.values(languageCounts),
  }];

  const languageOptions = {
    series: languageSeries,
    chart: {
      width: 400,
      type: 'line', 
    },
    xaxis: {
      categories: languageLabels,
      labels: {
        style: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
    },
    colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#3f51b5",
        "#03a9f4",
        "#4caf50",
        "#f9ce1d",
        "#FF9800"
      ],
    dataLabels: {
    
      enabled: true,
     style: {
       colors: [isDarkTheme ? '#FFFFFF' : '#000000'],
     },
    },
    stroke: {
      curve: 'smooth', 
    },
    fill: {
      type: 'gradient',
    },
    legend: {
     
      position: 'right',
      labels: {
        colors: isDarkTheme ? '#FFFFFF' : '#000000', 
      },
    },
    title: {
      text: 'Instagram Influencer Languages',
      align: 'left',
      style: {
     
        color: isDarkTheme ? '#FFFFFF' : '#000000', 
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
 

  return (
    <div className="w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar">
      <ApexCharts
        options={languageOptions}
        series={languageOptions.series}
        type="bar" 
        width={languageOptions.chart.width}
      />
    </div>
  );
};

export default BarLineChart;
