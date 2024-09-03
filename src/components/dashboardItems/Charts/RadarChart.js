// src/components/RadarChart.js

import React, { useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';

const RadarChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
    const [selectedSpamScore, setSelectedSpamScore] = useState('allMozSpamScore');

    const handleChange = (event) => {
        setSelectedSpamScore(event.target.value);
    };

    // Parse and count spam scores
    const spamScoreCounts = data.reduce((acc, item) => {
        const spamScore = item.mozSpamScore;
        if (selectedSpamScore === 'allMozSpamScore' || spamScore === selectedSpamScore) {
            acc[spamScore] = (acc[spamScore] || 0) + 1;
        }
        return acc;
    }, {});
//console.log(spamScoreCounts)
    // Define categories and series data
    const categories = [
        'Spam Score <= 01',
        'Spam Score <= 02',
        'Spam Score <= 05',
        'Spam Score <= 10',
        'Spam Score <= 20',
        'Spam Score <= 30'
    ];
    const sortedTraffic = Object.entries(spamScoreCounts).sort((a, b) => b[1] - a[1]);
    const seriesData = sortedTraffic.map(([, count]) => count);
   // const seriesData = categories.map(category => spamScoreCounts[category] || 0);
   // console.log("series data",seriesData)

    const series = [{
        name: 'Spam Score Count',
        data: seriesData
    }];

    const colors = ['#FF6347', '#FF69B4', '#FFD700', '#32CD32', '#1E90FF', '#8A2BE2'];

    const options = {
        chart: {
            height: 350,
            type: 'radar',
        },
        title: {
            text: 'Spam Score Distribution',
        },
        colors: colors,
        series: series,
        xaxis: {
            categories: categories
        },
        yaxis: {
            tickAmount: 7,
            labels: {
                formatter: function(val) {
                    return val;
                }
            }
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: '#e9e9e9',
                    fill: {
                        colors: ['#f5f5f5', '#f5f5f5']
                    }
                }
            }
        }
    };

    return (
        <div className="p-4 w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar">
            <div className="flex flex-col mb-4">
                <label htmlFor="mozSpamScore">Moz Spam Score</label>
                <select
                    id="mozSpamScore"
                    name="mozSpamScore"
                    value={selectedSpamScore}
                    onChange={handleChange}
                    className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
                >
                    <option value="allMozSpamScore">All</option>
                    <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
                    <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
                    <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
                    <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
                    <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
                    <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
                </select>
            </div>

            <ApexCharts
                options={options}
                series={series}
                type="radar"
                height={options.chart.height}
            />
        </div>
    );
};

export default RadarChart;










// src/components/RadarChart.js
/*import React from 'react';
import ApexCharts from 'react-apexcharts';

const RadarChart = ({data}) => {
    /*const options = {
        series: [{
            name: 'Series 1',
            data: [80, 50, 30, 40, 100, 20],
        }],
        chart: {
            height: 350,
            type: 'radar',
        },
        title: {
            text: 'Basic Radar Chart'
        },
        yaxis: {
            tickAmount: 7,
            labels: {
                formatter: function(val) {
                    return val;
                }
            }
        },
        xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June']
        }
    };

   
    const [selectedTraffic, setSelectedTraffic] = useState('allMonthlyTraffic');

    const handleChange = (event) => {
      setSelectedTraffic(event.target.value);
    };
  
    // Parse and count monthly traffic
    const trafficCounts = data.reduce((acc, item) => {
      const traffic = parseInt(item.monthlyTraffic.replace(/[^0-9]/g, ''));
      if (selectedTraffic === 'allMonthlyTraffic' || traffic >= parseInt(selectedTraffic.replace(/[^0-9]/g, ''))) {
        acc[traffic] = (acc[traffic] || 0) + 1;
      }
      return acc;
    }, {});
  
    const sortedTraffic = Object.entries(trafficCounts).sort((a, b) => b[1] - a[1]);
  
    const categories = sortedTraffic.map(([traffic]) => `>= ${traffic}`);
    const seriesData = sortedTraffic.map(([, count]) => count);
  
    const series = [{
      name: "Monthly Traffic",
      data: seriesData,
    }];
  
    const colors = ['#1E90FF', '#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#FF69B4', '#FFA500', '#DA70D6'];
  
    const options = {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {
            // handle chart click event
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      title: {
          text: 'Monthly Traffic',
        },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    };
    return (
        <div id="chart" className="p-4">
            <ApexCharts 
                options={options} 
                series={options.series} 
                type="radar" 
                height={options.chart.height} 
            />
        </div>
    );
};

export default RadarChart;*/













/*import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const DistributedColumns = ({ data }) => {
  const [selectedTraffic, setSelectedTraffic] = useState('allMozSpamScore');

  const handleChange = (event) => {
    setSelectedTraffic(event.target.value);
  };

  // Parse and count monthly traffic
  const trafficCounts = data.reduce((acc, item) => {
    const traffic = parseInt(item.monthlyTraffic.replace(/[^0-9]/g, ''));
    if (selectedTraffic === 'allMozSpamScore' || traffic >= parseInt(selectedTraffic.replace(/[^0-9]/g, ''))) {
      acc[traffic] = (acc[traffic] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedTraffic = Object.entries(trafficCounts).sort((a, b) => b[1] - a[1]);

  const categories = sortedTraffic.map(([traffic]) => `>= ${traffic}`);
  const seriesData = sortedTraffic.map(([, count]) => count);

  const series = [{
    name: "Monthly Traffic",
    data: seriesData,
  }];

  const colors = ['#1E90FF', '#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#FF69B4', '#FFA500', '#DA70D6'];

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {
          // handle chart click event
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    title: {
        text: 'Monthly Traffic',
      },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col mb-4">
        <label htmlFor="monthlyTraffic">Monthly Traffic</label>
        <select
          id="monthlyTraffic"
          name="monthlyTraffic"
          value={selectedTraffic}
          onChange={handleChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="allMozSpamScore">All</option>
          <option value="allMozSpamScore">All</option>
            <option value="Spam Score <= 01">Spam Score {"<="} 01</option>
            <option value="Spam Score <= 02">Spam Score {"<="} 02</option>
            <option value="Spam Score <= 05">Spam Score {"<="} 05</option>
            <option value="Spam Score <= 10">Spam Score {"<="} 10</option>
            <option value="Spam Score <= 20">Spam Score {"<="} 20</option>
            <option value="Spam Score <= 30">Spam Score {"<="} 30</option>
        </select>
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="radar" height={350} />
      </div>
    </div>
  );
};

export default DistributedColumns;*/






/*import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class DynamicChart extends Component {
  constructor(props) {
    super(props);
    this.data=this.props.data
    console.log(this.data)

    this.state = {
    
      series: [{
        name: 'TEAM A',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
      }, {
        name: 'TEAM B',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
      }, {
        name: 'TEAM C',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
      }],
      options: {
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
        labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
          '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
        ],
        markers: {
          size: 0
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          title: {
            text: 'Points',
          }
        },
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
      },
    
    
    };
  }


  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
      </div>
    );
  }
}

export default DynamicChart;*/















/**import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

const XAXISRANGE = 777600000; // 9 days in milliseconds
let lastDate = new Date().getTime();
let data = [];

function getNewSeries(baseval, yrange) {
  const newDate = baseval + 86400000;
  lastDate = newDate;
  for (let i = 0; i < data.length - 10; i++) {
    // maintain last 10 data points
    data[i].x = newDate - XAXISRANGE - (i * 86400000);
  }
  data = data.slice(data.length - 10, data.length);
  data.push({
    x: newDate,
    y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  });
}

class DynamicChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{
        data: data.slice()
      }],
      options: {
        chart: {
          id: 'realtime',
          height: 350,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Dynamic Updating Chart',
          align: 'left'
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: 'datetime',
          range: XAXISRANGE,
        },
        yaxis: {
          max: 100
        },
        legend: {
          show: false
        },
      },
    };
  }

  componentDidMount() {
    this.interval = window.setInterval(() => {
      getNewSeries(lastDate, {
        min: 10,
        max: 90
      });
      
      this.setState({
        series: [{
          data: data
        }]
      });
      
      window.ApexCharts.exec('realtime', 'updateSeries', [{
        data: data
      }]);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
      </div>
    );
  }
}

export default DynamicChart;
 */





/*import React from 'react';
import ReactApexChart from 'react-apexcharts';

// Function to convert date string to timestamp
const parseDate = (dateString) => new Date(dateString).getTime();

const MultiTypeChart = ({ data }) => {
  // Transform data into the format needed for the chart
  const generateSeriesData = (data) => {
    return [
      {
        name: 'Moz DA',
        type: 'column',
        data: data.map(item => ({
          x: parseDate(item.date),  // Convert date to timestamp
          y: item.mozDA,
        })),
      },
      {
        name: 'Ahrefs DR',
        type: 'area',
        data: data.map(item => ({
          x: parseDate(item.date),  // Convert date to timestamp
          y: item.ahrefsDR,
        })),
      },
      {
        name: 'Price',
        type: 'line',
        data: data.map(item => ({
          x: parseDate(item.date),  // Convert date to timestamp
          y: item.price,
        })),
      },
    ];
  };

  const options1 = {
    series: generateSeriesData(data),
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    stroke: {
      width: [0, 2, 5],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd/MM/yy', // Adjust format as needed
      },
    },
    yaxis: [
      {
        title: {
          text: 'Moz DA',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Ahrefs DR',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Price',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: 'dd MMM yyyy', // Adjust format as needed
      },
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' points';
          }
          return y;
        },
      },
    },
  };
  

  return (
    <div id="chart">
      <ReactApexChart options={options} series={options.series} type="line" height={350} />
    </div>
  );
};

export default MultiTypeChart;*/