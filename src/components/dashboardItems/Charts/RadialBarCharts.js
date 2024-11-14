
import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const RadialBarCharts = ({ data }) => {
  const { isDarkTheme} = useTheme();
  const totalLikes = data.reduce((sum, item) => sum + item.averageLikes, 0);
  const totalComments = data.reduce((sum, item) => sum + item.averageComments, 0);
  const averageLikes = totalLikes / data.length;
  const averageComments = totalComments / data.length;

  const likesPercentage = ((averageLikes / (averageLikes + averageComments)) * 100).toFixed(2);
  const commentsPercentage = ((averageComments / (averageLikes + averageComments)) * 100).toFixed(2);

  const options = {
    chart: {
      type: 'radialBar',
      height: 350,
    },
    title: {
        text: 'average Likes and Comments',
        align: 'left',
        style: {
          //fontSize: '24px',
          color: isDarkTheme ? '#FFFFFF' : '#000000', 
        },
      },
      fill: {
        type: 'gradient',
      },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
            color: isDarkTheme ? '#FFFFFF' : '#000000',
          },
          value: {
            fontSize: '16px',
            formatter: (val) => `${val}%`,
            color: isDarkTheme ? '#FFFFFF' : '#000000',
          },
          total: {
            show: true,
            label: 'Total',
            color: isDarkTheme ? '#FFFFFF' : '#000000',
            formatter: function () {
              return '100%';
            },
            style: {
              color: isDarkTheme ? '#FFFFFF' : '#000000', // Total label color
             // fontSize: '20px', // Customize total label font size if needed
            },
          },
        },
        hollow: {
          margin: 10,
          size: '50%',
          background: 'transparent',
        },
        track: {
          background: '#f2f2f2',
          strokeWidth: '100%',
        },
      },
    },
    labels: ['Likes', 'Comments'],
    legend: {
      labels: {
        colors: isDarkTheme ? '#FFFFFF' : '#000000', 
      },
    },
  };

  const series = [likesPercentage, commentsPercentage];

  return (
    <div className="w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar">
      <ApexCharts
        options={options}
        series={series}
        type="radialBar"
        height={350}
      />
    </div>
  );
};

export default RadialBarCharts;
