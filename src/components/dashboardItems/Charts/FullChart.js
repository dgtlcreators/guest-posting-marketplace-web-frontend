
import React from 'react';
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
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function(val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    title: {
      text: 'Categories',
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
