

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PieChart from './Charts/PieChart';
import FunnelCharts from './Charts/FunnelCharts';
import DistributedColumns from './Charts/DistributedColumns';
import RadarChart from './Charts/RadarChart';
import MixedChart from './Charts/MixedChart';

const GuestPostAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/form/getData');
        const response = await axios.get('https://guest-posting-marketplace-web-backend.onrender.com/form/getData');
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mt-1 p-4 bg-white shadow-md rounded-lg">
    <h2 className="text-xl font-bold mb-4">Guest Post Analytics</h2>
    <div className="chart-container flex flex-wrap gap-4">
      <div className="chart-item flex-1 min-w-[300px]">
        <PieChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <FunnelCharts data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <DistributedColumns data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <RadarChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <MixedChart data={data} />
      </div>
    </div>
  </div>
  );
};

export default GuestPostAnalytics;
/**
import React from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import DoughnutChart from './DoughnutChart.js';
import RadarChart from './RadarChart.js';
import BubbleChart from './BubbleChart.js';
import LineChart from './LineChart';
import ScatterPlot from './ScatterPlot.js';
import Histogram from './Histogram.js';

const Analytics = () => {
  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <div style={{ width: '600px', height: '400px' }}>
        <BarChart />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <PieChart />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <LineChart />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <ScatterPlot />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <Histogram />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <DoughnutChart />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <RadarChart />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <BubbleChart />
      </div>
    </div>
  );
};

export default Analytics; */
