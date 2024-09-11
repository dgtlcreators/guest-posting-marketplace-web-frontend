import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GuestPostOverview from './GuestPostOverview';
import GuestPostAnalytics from './GuestPostAnalytics';
import InstagramInfluencerOverview from './InstagramInfluencerOverview';
import InstagramInfluencerAnalytics from './InstagramInfluencerAnalytics';
import YoutubeInfluencerOverview from './YoutubeInfluencerOverview.js';
import YoutubeInfluencerAnalytics from './YoutubeInfluencerAnalytics.js';
import ContentWriterOverview from './ContentWriterOverview.js';
import ContentWriterAnalytics from './ContentWriterAnalytics.js';
import { useTheme } from '../../context/ThemeProvider.js';


const Dashboard = () => {
  const { isDarkTheme } = useTheme();
  const [section, setSection] = useState('all');

  const getButtonClasses = (isActive) => {
    return `btn ${isActive ? 'btn-active' : ''} ${isDarkTheme ? 'text-white bg-gray-800' : 'text-black bg-white'}`;
  };

  const renderSection = () => {
    switch (section) {
      case 'guestPost':
        return (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
            >
              <GuestPostOverview />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <GuestPostAnalytics />
            </motion.div>
          </>
        );
      case 'instagramInfluencer':
        return (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
            >
              <InstagramInfluencerOverview />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <InstagramInfluencerAnalytics />
            </motion.div>
          </>
        );
        case 'youtubeInfluencer':
          return (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3 }}
              >
                <YoutubeInfluencerOverview />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <YoutubeInfluencerAnalytics />
              </motion.div>
            </>
          );
          case 'contentWriter':
            return (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3 }}
                >
                  <ContentWriterOverview />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <ContentWriterAnalytics />
                </motion.div>
              </>
            );
      case 'all':
      default:
        return (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
            >
              <GuestPostOverview />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <InstagramInfluencerOverview />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3 }}
              >
                <YoutubeInfluencerOverview />
              </motion.div>
              <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3 }}
                >
                  <ContentWriterOverview />
                </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <GuestPostAnalytics />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <InstagramInfluencerAnalytics />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <YoutubeInfluencerAnalytics />
              </motion.div>
              <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <ContentWriterAnalytics />
                </motion.div>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap space-x-4 mb-4">
        <motion.button
         className={getButtonClasses(section === 'all')}
          //className={`btn ${section === 'all' ? 'btn-active' : ''}`}
          onClick={() => setSection('all')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          All
        </motion.button>
        <motion.button
        className={getButtonClasses(section === 'guestPost')}
         // className={`btn ${section === 'guestPost' ? 'btn-active' : ''}`}
          onClick={() => setSection('guestPost')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Guest Post
        </motion.button>
        <motion.button
        className={getButtonClasses(section === 'instagramInfluencer')}
          //className={`btn ${section === 'instagramInfluencer' ? 'btn-active' : ''}`}
          onClick={() => setSection('instagramInfluencer')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Instagram Influencer
        </motion.button>
        <motion.button
        className={getButtonClasses(section === 'youtubeInfluencer')}
          //className={`btn ${section === 'instagramInfluencer' ? 'btn-active' : ''}`}
          onClick={() => setSection('youtubeInfluencer')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Youtube Influencer
        </motion.button>
        <motion.button
        className={getButtonClasses(section === 'contentWriter')}
          //className={`btn ${section === 'instagramInfluencer' ? 'btn-active' : ''}`}
          onClick={() => setSection('contentWriter')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Content Writer
        </motion.button>
      </div>
      
      {renderSection()}
    </div>
  );
};

export default Dashboard;
