
import React from 'react'
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const BarCharts = ({data}) => {
  const { isDarkTheme } = useTheme();
    const followersCount = data.map(item => item.followersCount);
    const followingCount = data.map(item => item.followingCount);
    

    const labels = data.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index)); 
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); 
    });

    var options = {
        series: [{
        name: 'followersCount',
        data: followersCount,
        color: isDarkTheme ? '#00FF00' : '#0000FF',      
      }, {
        name: 'followingCount',
        data: followingCount,
        color: isDarkTheme ? '#FF00FF' : '#FFA500', 
       
      },],
        chart: {
        type: 'bar',
        height: 350
      },
      colors: [
        isDarkTheme ?'#FFFFFF' : '#000000', 
        isDarkTheme ? '#FFFFFF' : '#000000', 
      ],
      title: {
        text: 'Followers and Following count',
        align: 'left',
        style: {
         
          color: isDarkTheme ? '#FFFFFF' : '#000000', 
        },
    },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
       // enabled: false
       enabled: true, 
       
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['transparent']
      },
      labels: labels,
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: isDarkTheme ? '#FFFFFF' : '#000000',
          },
        },
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
          align: 'left',
          style: {
            //fontSize: '24px',
            color: isDarkTheme ? '#FFFFFF' : '#000000', 
          },
        },
        labels: {
          style: {
            colors: isDarkTheme ? '#FFFFFF' : '#000000',
          },
        },
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      },
      legend: {
        labels: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        },
      },
      tooltip: {
        enabled: true,
        custom: function({ seriesIndex, dataPointIndex, w }) {
         
          const headerClass = isDarkTheme ? 'tooltip-header-dark' : 'tooltip-header-light';
          const contentClass = isDarkTheme ? 'tooltip-content-dark' : 'tooltip-content-light';
  
         
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
      legend: {
        labels: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        },
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
      type="bar"
      height={350}
    />
 </div>
  )
}

export default BarCharts