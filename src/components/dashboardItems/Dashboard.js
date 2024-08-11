import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GuestPostOverview from './GuestPostOverview';
import GuestPostAnalytics from './GuestPostAnalytics';
import InstagramInfluencerOverview from './InstagramInfluencerOverview';
import InstagramInfluencerAnalytics from './InstagramInfluencerAnalytics';
import { useTheme } from '../../context/ThemeProvider';


const Dashboard = () => {
  const { isDarkTheme } = useTheme();
  const [section, setSection] = useState('all');

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
          </>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap space-x-4 mb-4">
        <motion.button
          className={`btn ${section === 'all' ? 'btn-active' : ''}`}
          onClick={() => setSection('all')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          All
        </motion.button>
        <motion.button
          className={`btn ${section === 'guestPost' ? 'btn-active' : ''}`}
          onClick={() => setSection('guestPost')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Guest Post
        </motion.button>
        <motion.button
          className={`btn ${section === 'instagramInfluencer' ? 'btn-active' : ''}`}
          onClick={() => setSection('instagramInfluencer')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Instagram Influencer
        </motion.button>
      </div>
      {renderSection()}
    </div>
  );
};

export default Dashboard;
