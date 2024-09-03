import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '../../../context/ThemeProvider';


const GaugeChart = ({ data }) => {
  const { isDarkTheme } = useTheme();
  const chartRef = useRef(null);

 
  const engagementRates = data.map(item => item.engagementRate);
  const averageEngagementRate = engagementRates.reduce((acc, rate) => acc + rate, 0) / engagementRates.length;

 
  const formattedAverageEngagementRate = averageEngagementRate.toFixed(2);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: 'Average Engagement Rate',
          type: 'gauge',
          detail: {
            valueAnimation: true,
            formatter: `{value}%`
          },
          title: {
            text: 'Average Engagement Rate',
          },
          data: [
            {
              value: formattedAverageEngagementRate,
              name: 'Rate'
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

    // Resize chart on window resize
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [formattedAverageEngagementRate]);

  return (
    <div className='w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar'
      ref={chartRef}
      style={{ width: '100%', height: '400px' }} 
    />
  );
};

export default GaugeChart;
