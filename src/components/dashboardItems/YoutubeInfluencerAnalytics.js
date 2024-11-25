import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useTheme } from '../../context/ThemeProvider.js';
import { UserContext } from '../../context/userContext.js';
import Linecharts from './Charts/LineCharts2.js';
import BarCharts from './Charts/BarCharts2.js';
import RadialBarCharts from './Charts/RadialBarCharts.js';
import FullChart from './Charts/FullChart.js';
import BarLineChart from './Charts/BarLineChart.js';
import GaugeChart from './Charts/GaugeChart.js';
import MapChart from './Charts/MapChart.js';



const YoutubeInfluencerAnalytics = () => {
  const { isDarkTheme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData, localhosturl } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${localhosturl}/youtubeinfluencers/getAllYoutubeInfluencer`);
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
   // return <div>Loading...</div>;
  }

  if (error) {
   // return <div>Error: {error.message}</div>;
  }

  const influencers = data || [];


  const followersCountData = [
    ['Influencer', 'Followers'],
    ...influencers.map(influencer => [influencer.username, influencer.followersCount]),
  ];

  const engagementRateData = [
    ['Influencer', 'Engagement Rate'],
    ...influencers.map(influencer => [influencer.username, influencer.engagementRate]),
  ];

  const collaborationData = [
    ['Type', 'Count'],
    ['Sponsored Videos', influencers.reduce((sum, influencer) => sum + influencer.collaborationRates.sponsoredVideos, 0)],
    ['Product Reviews', influencers.reduce((sum, influencer) => sum + influencer.collaborationRates.productReviews, 0)],
    ['Shoutouts', influencers.reduce((sum, influencer) => sum + influencer.collaborationRates.shoutouts, 0)],
  ];

  const demographicsData = [
    ['Demographic', 'Count'],
    ['Age', influencers.reduce((sum, influencer) => sum + influencer.audienceDemographics.age.length, 0)],
    ['Gender', influencers.reduce((sum, influencer) => sum + influencer.audienceDemographics.gender.length, 0)],
    ['Geographic Distribution', influencers.reduce((sum, influencer) => sum + influencer.audienceDemographics.geographicDistribution.length, 0)],
  ];
  

  const averageViewsData = [
    ['Influencer', 'Average Views'],
    ...influencers.map(influencer => [influencer.username, influencer.averageViews]),
  ];

  const videosCountData = [
    ['Influencer', 'Videos Count'],
    ...influencers.map(influencer => [influencer.username, influencer.videosCount]),
  ];


  return (
    <div className="mt-1 p-4  shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-2 p-2">Youtube Influencer Analytics</h3>
      <div className="chart-container flex flex-wrap gap-4">
      <div className="chart-item flex-1 min-w-[300px]">
      <Linecharts data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
      <BarCharts data={data}/>
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <FullChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <BarLineChart data={data} />
      </div>
      <div className="chart-item flex-1 min-w-[300px]">
        <GaugeChart data={data} />
      </div>
     { /*<div className="chart-item flex-1 min-w-[300px]">
        <MapChart data={data} />
      </div>*/}
    
    
    
    </div>
      <div className="chart-container flex flex-wrap gap-4">
      <div className="chart-item flex-1 min-w-[300px]"></div>
      <div className="chart-item flex-1 min-w-[300px]"></div>
      <div className="chart-item flex-1 min-w-[300px]"></div>
      <div className="chart-item flex-1 min-w-[300px]"></div>
      <div className="chart-item flex-1 min-w-[300px]"></div>
      <div className="chart-item flex-1 min-w-[300px]"></div>
      </div>

    { /* <div className="chart-container flex flex-wrap gap-4">
        <div className="chart-item flex-1 min-w-[300px]">
          <Chart
            chartType="ColumnChart"
            data={followersCountData}
            options={{ title: 'Followers Count', height: 300 }}
          />
        </div>
        <div className="chart-item flex-1 min-w-[300px]">
          <Chart
            chartType="BarChart"
            data={engagementRateData}
            options={{ title: 'Engagement Rate', height: 300 }}
          />
        </div>
        <div className="chart-item flex-1 min-w-[300px]">
          <Chart
            chartType="PieChart"
            data={collaborationData}
            options={{ title: 'Collaboration Rates', height: 300 }}
          />
        </div>

        
        <div className="chart-item flex-1 min-w-[300px]">
  {demographicsData.length > 1 && (
    <Chart
      chartType="PieChart"
      data={demographicsData}
      options={{
        title: 'Audience Demographics',
        height: 300,
        pieHole: 0.4, // This creates a doughnut effect
      }}
    />
  )}
</div>
<div className="chart-item flex-1 min-w-[300px]">
  {averageViewsData.length > 1 && (
    <Chart
      chartType="LineChart"
      data={averageViewsData}
      options={{ title: 'Average Views per Influencer', height: 300 }}
    />
  )}
</div>
<div className="chart-item flex-1 min-w-[300px]">
  {videosCountData.length > 1 && (
    <Chart
      chartType="AreaChart"
      data={videosCountData}
      options={{ title: 'Videos Count', height: 300 }}
    />
  )}
</div>


      </div>*/}
    </div>
  );
};

export default YoutubeInfluencerAnalytics;
