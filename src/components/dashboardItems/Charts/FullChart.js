

import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

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
      theme: isDarkTheme ? 'dark' : 'light', // Set the tooltip theme
      custom: function({ seriesIndex, dataPointIndex, w }) {
        // Custom content for the tooltip
        const category = categories[dataPointIndex];
        const count = w.globals.series[seriesIndex][dataPointIndex];
        
        // Tooltip content customization based on the theme
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




/*import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const FullChart = ({ data }) => {
  const { isDarkTheme} = useTheme();
  const categoryCounts = {};


  data.forEach(item => {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });

  
  const categories = Object.keys(categoryCounts);
  const series = Object.values(categoryCounts);

  const options = {
    series,
  // series: [{
  //  name: 'Categories',
  //  data: series, // Use actual data for the y-axis
//  }],
    chart: {
      width: 400,//400
      type: 'pie',
    },
    labels: categories,
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    xaxis:{
      labels: {
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000', // X-axis label color
        },
      },
      title: {
       
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000', // Y axis title color
        },
      },
      labels: {
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000', 
        },
      },

    },
    yaxis:{
      title: {
       
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000', // Y axis title color
        },
      },
      labels: {
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000', // X axis label color
        },
      },

    },
    dataLabels: {
     // enabled: false,
     enabled: true,
     style: {
       colors: [isDarkTheme ? '#FFFFFF' : '#000000'],
     },
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function(val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
      position: 'right',
      labels: {
        colors: isDarkTheme ? '#FFFFFF' : '#000000', 
      },
    },
    title: {
      text: 'Categories',
      align: 'left',
      style: {
        //fontSize: '24px',
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
        options={options}
        series={options.series}
        type="pie"
        width={options.chart.width}
      />
      
    </div>
  );
};

export default FullChart;
*/