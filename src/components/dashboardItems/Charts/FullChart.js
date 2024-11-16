

import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const FullChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
  const categoryCounts = {};

  
  data.forEach(item => {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });

  const categories = Object.keys(categoryCounts);
  const series = Object.values(categoryCounts);

  
  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
      title: {
        text: 'Categories',
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
      labels: {
        style: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
    },
    series: [{
      name: 'Counts',
      data: series,
    }],
    title: {
      text: 'Category Distribution',
      align: 'left',
      style: {
        color: isDarkTheme ? '#FFFFFF' : '#000000',
      },
    },
    legend: {
      labels: {
        colors: isDarkTheme ? '#FFFFFF' : '#000000',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [isDarkTheme ? '#FFFFFF' : '#000000'],
      },
    },
    tooltip: {
      enabled: true,
      theme: isDarkTheme ? 'dark' : 'light',
      custom: function({ seriesIndex, dataPointIndex, w }) {
   
        const category = categories[dataPointIndex];
        const count = w.globals.series[seriesIndex][dataPointIndex];
        
       
        const headerClass = isDarkTheme ? 'tooltip-header-dark' : 'tooltip-header-light';
        const contentClass = isDarkTheme ? 'tooltip-content-dark' : 'tooltip-content-light';

        return `
          <div class="${headerClass}">
            ${category}: ${count}
          </div>
          <div class="${contentClass}">
            Count: ${count}
          </div>
        `;
      },
      marker: {
        show: true,
      },
      fillSeriesColor: true,
    },
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow-lg calendar">
      <ApexCharts
        options={options}
        series={options.series}
        type="bar"
        height={350}
      />
    </div>
  );
};


export default FullChart;

