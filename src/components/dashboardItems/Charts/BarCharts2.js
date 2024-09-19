
import React from 'react'
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const BarCharts = ({data}) => {
  const { isDarkTheme } = useTheme();
    const followersCount = data.map(item => item.followersCount);
    const videosCount = data.map(item => item.videosCount);
    

    const labels = data.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index)); 
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); 
    });

    var options = {
        series: [{
        name: 'followersCount',
        data: followersCount
      }, {
        name: 'videosCount',
        data: videosCount
      },],
        chart: {
        type: 'bar',
        height: 350
      },
      title: {
        text: 'Followers and videos count',
        align: 'left',
        style: {
          //fontSize: '24px',
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
        enabled: false
      },
      stroke: {
        show: true,
        width: 3,
        colors: ['transparent']
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
          title: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
          },
          labels: {
            style: {
              colors: isDarkTheme ? '#FFFFFF' : '#000000',
            },
          },
        },
        
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      legend: {
       
        labels: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        }
      },
      grid: {
        borderColor: isDarkTheme ? '#555555' : '#E0E0E0' 
      }
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