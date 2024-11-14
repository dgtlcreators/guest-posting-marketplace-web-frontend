
import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const MixedChart = ({ data }) => {
  const { isDarkTheme } = useTheme();

  const mozDA = data.map(item => item.mozDA);
  const ahrefsDR = data.map(item => item.ahrefsDR);
  const price = data.map(item => item.price);
   
  const labels = data.map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (data.length - index)); 
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); 
  });

  const options = {
    series: [
      {
        name: 'mozDA',
        type: 'column',
        data: mozDA
      },
      {
        name: 'ahrefsDR',
        type: 'area',
        data: ahrefsDR
      },
      {
        name: 'price',
        type: 'line',
        data: price
      }
    ],
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    stroke: {
      width: [0, 2, 5],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: labels,
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000', 
        }
      },
      title: {
        text: 'Date',
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000',
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'mozDA / ahrefsDR',
          align: 'left',
          style: {
            color: isDarkTheme ? '#FFFFFF' : '#000000', 
          },
        },
        labels: {
          style: {
            colors: isDarkTheme ? '#FFFFFF' : '#000000', 
          }
        }
      },
      {
        opposite: false,
        title: {
          text: 'price',
          align: 'left',
          style: {
            color: isDarkTheme ? '#FFFFFF' : '#000000', 
          },
        },
        labels: {
          style: {
            colors: isDarkTheme ? '#FFFFFF' : '#000000', 
          }
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        }
      }
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
        // Tooltip header customization
        const headerClass = isDarkTheme ? 'custom-tooltip-header dark' : 'custom-tooltip-header light';
        const contentClass = isDarkTheme ? 'custom-tooltip-content dark' : 'custom-tooltip-content light';

        return `
          <div class="${headerClass}">
            Spam Score: ${w.globals.labels[dataPointIndex]} 
          </div>
          <div class="${contentClass}">
            Count: ${w.globals.series[seriesIndex][dataPointIndex]}
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
    <div id="chart" className="p-4 w-full max-w-md mx-auto rounded-lg shadow-lg calendar">
      <ApexCharts
        options={options}
        series={options.series}
        type="line"
        height={options.chart.height}
      />
    </div>
  );
};

export default MixedChart;


/*

import React from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const MixedChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
   
    const mozDA = data.map(item => item.mozDA);
    const ahrefsDR = data.map(item => item.ahrefsDR);
    const price = data.map(item => item.price);
    //console.log("mozDA.ahrefsDR,price ",mozDA.ahrefsDR,price)
//console.log("price",price)
   
    const labels = data.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index)); 
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); 
    });

    var options = {
        series: [
            {
                name: 'mozDA',
                type: 'column',
                data: mozDA
            },
            {
                name: 'ahrefsDR',
                type: 'area',
                data: ahrefsDR
            },
            {
                name: 'price',
                type: 'line',
                data: price
            }
        ],
        chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: labels,
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime',
        
      },
      yaxis: [
            {
                title: {
                    text: 'mozDA / ahrefsDR',
                    align: 'left',
                    style: {
                      //fontSize: '24px',
                      color: isDarkTheme ? '#FFFFFF' : '#000000', 
                    },
                }
            },
            {
                opposite: false,
                title: {
                    text: 'price',
                    align: 'left',
                    style: {
                      //fontSize: '24px',
                      color: isDarkTheme ? '#FFFFFF' : '#000000', 
                    },
                }
            }
        ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
      
          }
        }
      }
      };
 
      

    return (
        <div id="chart" className="p-4 w-full max-w-md mx-auto p-4 rounded-lg shadow-lg calendar">
            <ApexCharts
                options={options}
                series={options.series}
                type="line"
                height={options.chart.height}
            />
        </div>
    );
};

export default MixedChart;

*/