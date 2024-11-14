import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import { useTheme } from '../../context/ThemeProvider';
import { UserContext } from '../../context/userContext';


const ContentWriterOverview = () => {
  const { isDarkTheme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData ,localhosturl} = useContext(UserContext);

  const MAX_LANGUAGES = 3; 
  const MAX_EXPERIENCE = 5;


  const [contentwriterCount, setContentwriterCount] = useState(0);
  const [totalExperience, setTotalExperiences] = useState(0);
  const [averageEngagementRate, setAverageEngagementRate] = useState(0);

  const [experienceLevelPercentage, setExperienceLevelPercentage] = useState(0);
  const [profileCompletenessPercentage, setProfileCompletenessPercentage] = useState(0);
  const [languageProficiencyPercentage, setLanguageProficiencyPercentage] = useState(0);


  
  const chartSpark1Ref = useRef(null);
  const chartSpark2Ref = useRef(null);
  const chartSpark3Ref = useRef(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${localhosturl}/contentwriters/getallcontentwriters`);
        const fetchedData = response.data.data;

        setData(fetchedData);
        setContentwriterCount(fetchedData.length);

      
        const experienceTotal = fetchedData.reduce((acc, item) => acc + (item.experience || 0), 0);
        setTotalExperiences(experienceTotal);


        setExperienceLevelPercentage(Math.min((experienceTotal / MAX_EXPERIENCE) * 100, 100));

      
        const engagementRateTotal = fetchedData.reduce((acc, item) => acc + (item.engagementRate || 0), 0);
        setAverageEngagementRate(fetchedData.length ? (engagementRateTotal / fetchedData.length) : 0);

     
        const totalFields = 8; 
        const filledFields = fetchedData.reduce((acc, item) => {
          let filledCount = 0;
          if (item.name) filledCount++;
          if (item.bio) filledCount++;
          if (item.experience) filledCount++;
          if (item.email) filledCount++;
          if (item.location) filledCount++;
         
          return acc + filledCount;
        }, 0);

        setProfileCompletenessPercentage(Math.min((filledFields / (fetchedData.length * totalFields)) * 100, 100));

   
        const uniqueLanguages = new Set();
        fetchedData.forEach(item => {
          if (item.languages && Array.isArray(item.languages)) {
            item.languages.forEach(lang => uniqueLanguages.add(lang));
          }
        });

        setLanguageProficiencyPercentage(Math.min((uniqueLanguages.size / MAX_LANGUAGES) * 100, 100)); 


        const languageCount = fetchedData.reduce((acc, item) => {
          if (item.languages && Array.isArray(item.languages)) {
            return acc + item.languages.length; 
          }
          return acc;
        }, 0);
        
       
        

        setLanguageProficiencyPercentage(Math.min((uniqueLanguages.size / MAX_LANGUAGES) * 100, 100));
        
 
        const totalLanguagesPercentage = Math.min((languageCount / (fetchedData.length * MAX_LANGUAGES)) * 100, 100);
        setLanguageProficiencyPercentage(totalLanguagesPercentage);
        

        setLoading(false);
        initializeCharts(fetchedData, experienceTotal, totalLanguagesPercentage);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) {
      initializeCharts(data, totalExperience, languageProficiencyPercentage);
    }
  }, [isDarkTheme, data, totalExperience, languageProficiencyPercentage]);

  const initializeCharts = (fetchedData, totalExperience, languageProficiencyPercentage) => {
    const textColor = isDarkTheme ? '#FFFFFF' : '#000000'; 
    const sparklineData = fetchedData.map(item => item.engagementRate || 0);

    if (chartSpark1Ref.current) {
      chartSpark1Ref.current.innerHTML = '';
    }
    if (chartSpark2Ref.current) {
      chartSpark2Ref.current.innerHTML = '';
    }
    if (chartSpark3Ref.current) {
      chartSpark3Ref.current.innerHTML = '';
    }


    var optionsSpark1 = {
      series: [{
        data: sparklineData
      }],
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#00E396'],
      title: {
        text: `${totalExperience}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: textColor 
        }
      },
      subtitle: {
        text: 'Total Experience',
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: textColor 
        }
      }
    };

    if (chartSpark1Ref.current) {
      new ApexCharts(chartSpark1Ref.current, optionsSpark1).render();
    }

    var optionsSpark2 = {
      series: [{
        data: sparklineData
      }],
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#FEB019'],
      title: {
        text: `${languageProficiencyPercentage.toFixed(2)}%`,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: textColor 
        }
      },
      subtitle: {
        text: 'Avg Language Proficiency',
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: textColor 
        }
      }
    };

    if (chartSpark2Ref.current) {
      new ApexCharts(chartSpark2Ref.current, optionsSpark2).render();
    }
   

    var optionsSpark3 = {
      series: [{
        data: sparklineData
      }],
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0
      },
      colors: ['#FF4560'],
      title: {
        text: `${fetchedData.length}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: textColor 
        }
      },
      subtitle: {
        text: 'Total Content Writers',
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: textColor 
        }
      }
    };

    if (chartSpark3Ref.current) {
      new ApexCharts(chartSpark3Ref.current, optionsSpark3).render();
    }
  };

  if (loading) {
  //  return <div>Loading...</div>;
  }

  if (error) {
   // return <div>Error: {error.message}</div>;
  }


  return (
     <div className="p-4 shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-4 p-2">Content Writer Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md rounded-lg" ref={chartSpark3Ref}>
        <h3 className="text-lg font-semibold bg-transparent">Total Content Writer</h3>
        <p className="text-2xl">{contentwriterCount}</p>
        </div>
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md" ref={chartSpark1Ref}>
          <h3 className="text-lg font-semibold bg-transparent">Total Experiences</h3>
          <p className="text-2xl">{totalExperience}</p>
        </div>
       
        {/*<div className="p-4 rounded-lg flex flex-col items-center shadow-md">
          <h3 className="text-lg font-semibold bg-transparent">Experience Level</h3>
          <p className="text-2xl">{experienceLevelPercentage.toFixed(0)}%</p>
        </div>
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md">
          <h3 className="text-lg font-semibold bg-transparent">Profile Completeness</h3>
          <p className="text-2xl">{profileCompletenessPercentage.toFixed(0)}%</p>
        </div>*/}
        <div className="p-4 rounded-lg flex flex-col items-center shadow-md"  ref={chartSpark2Ref}>
          <h3 className="text-lg font-semibold bg-transparent">Avg Language Proficiency</h3>
          <p className="text-2xl">{languageProficiencyPercentage.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};

export default ContentWriterOverview;
