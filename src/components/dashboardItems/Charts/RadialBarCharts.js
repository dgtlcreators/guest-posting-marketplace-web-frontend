import React from 'react';
import ApexCharts from 'react-apexcharts';

const RadialBarCharts = ({ data }) => {
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
      },
      fill: {
        type: 'gradient',
      },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
            formatter: (val) => `${val}%`
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return '100%';
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
  };

  const series = [likesPercentage, commentsPercentage];

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
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
