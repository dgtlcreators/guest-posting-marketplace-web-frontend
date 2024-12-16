import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <h1 className="hero-title">Find the Perfect Creator</h1>
        <p className="hero-description">
          Connect with influencers and creators tailored to your needs using advanced search filters.
        </p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/search">Start Exploring</Link>
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="features-section"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="feature-item">
          <motion.div
            className="feature-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <i className="fas fa-search"></i>
          </motion.div>
          <h2 className="feature-title">Advanced Search Filters</h2>
          <p className="feature-description">
            Easily find creators based on platform, niche, location, and engagement.
          </p>
        </div>

        <div className="feature-item">
          <motion.div
            className="feature-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <i className="fas fa-users"></i>
          </motion.div>
          <h2 className="feature-title">Diverse Creator Database</h2>
          <p className="feature-description">
            Access a wide variety of influencers from different platforms and categories.
          </p>
        </div>

        <div className="feature-item">
          <motion.div
            className="feature-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <i className="fas fa-handshake"></i>
          </motion.div>
          <h2 className="feature-title">Seamless Collaboration</h2>
          <p className="feature-description">
            Connect and collaborate with influencers to scale your brand effectively.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
