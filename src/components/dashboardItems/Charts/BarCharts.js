import React from 'react'
import ApexCharts from 'react-apexcharts';

const BarCharts = ({data}) => {
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
        data: followersCount
      }, {
        name: 'followingCount',
        data: followingCount
      },],
        chart: {
        type: 'bar',
        height: 350
      },
      title: {
        text: 'Followers and Following count',
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
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
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
      }
      };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
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