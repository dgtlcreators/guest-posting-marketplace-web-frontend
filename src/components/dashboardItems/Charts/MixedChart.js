// src/components/MixedChart.js
import React from 'react';
import ApexCharts from 'react-apexcharts';

const MixedChart = ({ data }) => {
   
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
                    text: 'mozDA / ahrefsDR'
                }
            },
            {
                opposite: false,
                title: {
                    text: 'price'
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
        <div id="chart" className="p-4 w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
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
