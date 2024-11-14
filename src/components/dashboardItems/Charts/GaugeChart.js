import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '../../../context/ThemeProvider';


const GaugeChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
  const chartRef = useRef(null);
 // console.log("isDarkTheme ",isDarkTheme)

 
  const engagementRates = data.map(item => item.engagementRate);
  const averageEngagementRate = engagementRates.reduce((acc, rate) => acc + rate, 0) / engagementRates.length;

 
  const formattedAverageEngagementRate = averageEngagementRate.toFixed(2);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
        backgroundColor: isDarkTheme ? '#333' : '#fff',
        borderColor: isDarkTheme ? '#666' : '#ccc', 
        borderWidth: 1,
        textStyle: {
          color: isDarkTheme ? '#FFFFFF' : '#000000',
        }
      },
      series: [
        {
          name: 'Average Engagement Rate',
          type: 'gauge',
          detail: {
            valueAnimation: true,
            formatter: `{value}%`,
            textStyle: {
              color: isDarkTheme ? '#FFFFFF' : '#000000', // Dynamic color for detail
            }
          },
          title: {
            text: 'Average Engagement Rate',
            align: 'left',
            textStyle: {
              color: isDarkTheme ? '#FFFFFF' : '#000000', // Dynamic color for title
              fontSize: 24,
            },
            offsetCenter: [0, '90%'],
          },
          data: [
            {
              value: formattedAverageEngagementRate,
              name: 'Rate',//'Rate',
              style: {
                //fontSize: '24px',
                color: isDarkTheme ? '#FFFFFF' : '#000000', 
              },
            }
          ],
          axisLine: {
            lineStyle: {
              color: [[0.2, '#00FF00'], [0.8, '#FFBF00'], [1, '#FF0000']],
              width: 30
            }
          },
          splitLine: {
            show: false
          }
        }
      ]
    };

    myChart.setOption(option);


    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [formattedAverageEngagementRate,, isDarkTheme]);

  return (
    <div className='w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar'
      ref={chartRef}
      style={{ width: '100%', height: '400px' }} 
    />
  );
};

export default GaugeChart;
