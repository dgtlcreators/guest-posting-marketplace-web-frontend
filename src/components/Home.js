
import React from 'react';
import { motion } from 'framer-motion'; 
import { Link } from 'react-router-dom';
import "./Home.css"

const Home = () => {
  return (
    <div className="home-container">
    
      <motion.div
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        
        <h1 className="hero-title">Welcome to Our Platform</h1>
        <p className="hero-description">
          Build your presence, manage your projects, and scale your business with ease.
        </p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/dashboard">Get Started</Link>
        </motion.button>
      </motion.div>

     
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
            <i className="fas fa-users"></i>
          </motion.div>
          <h2 className="feature-title">Manage Your Team</h2>
          <p className="feature-description">Collaborate with your team seamlessly.</p>
        </div>

        <div className="feature-item">
          <motion.div
            className="feature-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <i className="fas fa-cogs"></i>
          </motion.div>
          <h2 className="feature-title">Powerful Tools</h2>
          <p className="feature-description">Access a suite of powerful features.</p>
        </div>

        <div className="feature-item">
          <motion.div
            className="feature-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <i className="fas fa-chart-line"></i>
          </motion.div>
          <h2 className="feature-title">Grow Your Business</h2>
          <p className="feature-description">Scale up your projects with ease.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
