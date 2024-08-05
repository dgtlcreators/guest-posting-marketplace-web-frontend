

import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const FunnelCharts = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('allLanguage');

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  // Count occurrences of each language
  const languageCounts = data.reduce((acc, item) => {
    if (selectedLanguage === 'allLanguage' || item.websiteLanguage === selectedLanguage) {
      acc[item.websiteLanguage] = (acc[item.websiteLanguage] || 0) + 1;
    }
    return acc;
  }, {});

  // Sort languages by count in descending order
  const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

  const categories = sortedLanguages.map(([language]) => language);
  const seriesData = sortedLanguages.map(([, count]) => count);

  const series = [{
    name: "Language Count",
    data: seriesData,
  }];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ': ' + val;
      },
      dropShadow: {
        enabled: true,
      },
    },
    title: {
      text: 'Website Language Distribution',
      align: 'middle',
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className='w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg'>
      <div className="flex flex-col">
        <label htmlFor="websiteLanguage">Website Language</label>
        <select
          id="websiteLanguage"
          name="websiteLanguage"
          value={selectedLanguage}
          onChange={handleChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="allLanguage">All</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Marathi">Marathi</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Urdu">Urdu</option>
          <option value="Odia">Odia</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Bengali">Bengali</option>
          <option value="Kannada">Kannada</option>
        </select>
      </div>
      <div id="chart" >
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default FunnelCharts;

/*import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const FunnelCharts = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('allLanguage');

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  // Count occurrences of each language
  const languageCounts = data.reduce((acc, item) => {
    if (selectedLanguage === 'allLanguage' || item.websiteLanguage === selectedLanguage) {
      acc[item.websiteLanguage] = (acc[item.websiteLanguage] || 0) + 1;
    }
    return acc;
  }, {});

  // Sort languages by count in descending order
  const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

  const categories = sortedLanguages.map(([language]) => language);
  const seriesData = sortedLanguages.map(([, count]) => count);

  const series = [{
    name: "Language Count",
    data: seriesData,
  }];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        barHeight: '80%',
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
      },
      dropShadow: {
        enabled: true,
      },
    },
    title: {
      text: 'Website Language Distribution',
      align: 'middle',
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="websiteLanguage">Website Language</label>
        <select
          id="websiteLanguage"
          name="websiteLanguage"
          value={selectedLanguage}
          onChange={handleChange}
          className="focus:outline focus:outline-blue-400 cursor-pointer p-2"
        >
          <option value="allLanguage">All</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Marathi">Marathi</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Urdu">Urdu</option>
          <option value="Odia">Odia</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Bengali">Bengali</option>
          <option value="Kannada">Kannada</option>
        </select>
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default FunnelCharts;
*/