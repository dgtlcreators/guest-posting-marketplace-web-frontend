

import React from 'react'
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const Linecharts = ({data}) => {
  const { isDarkTheme } = useTheme();

    const post = data.map(item => item.collaborationRates.post);
    const story = data.map(item => item.collaborationRates.story);
    const reel = data.map(item => item.collaborationRates.reel);

    const labels = data.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index)); 
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); 
    });

    
    var options = {
        series: [{
          name: "Post",
          data: post
        },
        {
          name: "Story",
          data: story
        },
        {
          name: 'Reel',
          data: reel
        }
      ],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      fill: {
      type: 'gradient',
    },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'collaborationRates',
        align: 'left',
        style: {
          //fontSize: '24px',
          color: isDarkTheme ? '#FFFFFF' : '#000000', 
        },
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
        },
       
      labels: { colors: isDarkTheme ? '#FFFFFF' : '#000000' },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      labels: labels,
      xaxis: {
        type: 'datetime',
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000',
        },
        labels: {
          style: {
            colors: isDarkTheme ? '#FFFFFF' : '#000000',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Collaboration Rates',
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
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)"
              }
            },
            labels: {
              style: {
                colors: isDarkTheme ? '#FFFFFF' : '#000000',
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session"
              }
            },
            labels: {
              style: {
                colors: isDarkTheme ? '#FFFFFF' : '#000000',
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            },
            labels: {
              style: {
                colors: isDarkTheme ? '#FFFFFF' : '#000000',
              },
            },
          },
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        }
      },
      grid: {
        borderColor: isDarkTheme ? '#555555' : '#E0E0E0' 
      },
      tooltip: {
        enabled: true,
        custom: function({ seriesIndex, dataPointIndex, w }) {
          const headerClass = isDarkTheme ? 'tooltip-header-dark' : 'tooltip-header-light';
          const contentClass = isDarkTheme ? 'tooltip-content-dark' : 'tooltip-content-light';
  
          // Tooltip content customization
          return `
            <div class="${headerClass}">
              Date: ${w.globals.labels[dataPointIndex]} 
            </div>
            <div class="${contentClass}">
              <strong>${w.config.series[seriesIndex].name}:</strong> ${w.globals.series[seriesIndex][dataPointIndex]} 
            </div>
          `;
        },
        marker: {
          show: true,
        },
        fillSeriesColor: true,
      },
      grid: {
        borderColor: isDarkTheme ? '#555555' : '#E0E0E0',
      },
      };
    

  return (
   
   <div className="w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar">
    <ApexCharts
       options={options}
       series={options.series}
      type="line"
      height={350}
    />
 </div>
  )
}

export default Linecharts