import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const VerificationSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    setTimeout(() => {
       // navigate('http://localhost:3000/login');
      //navigate('https://connect.creatorsxchange.com/login');
      navigate('http://connect.creatorsxchange.com/login');
    }, 5000);
    return () => clearInterval(timer);
  }, [navigate]);
  return (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #4a90e2, #87ceeb)', 
        padding: '20px' 
      }}>
        <div style={{
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
          animation: 'fadeIn 1.5s ease-in-out',
        }}>
          <h1 style={{ 
            color: '#4a90e2', 
            fontSize: '28px', 
            marginBottom: '20px',
            animation: 'bounceIn 1s ease-out' 
          }}>
            🎉 Verification Successful!
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#333', 
            marginBottom: '15px' 
          }}>
            Thank you for verifying your email! Your account is now activated, and you can start exploring CreatorXChange.
          </p>
          <p style={{ 
            fontSize: '16px', 
            color: '#666', 
            marginBottom: '15px' 
          }}>
            You will be redirected to the login page in <strong>{countdown} seconds</strong>.
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#999' 
          }}>
            If the page does not redirect automatically, <a href="http://localhost:3000"
           // href="https://connect.creatorsxchange.com" 
           // href="http://connect.creatorsxchange.com" 
            style={{ 
              color: '#4a90e2', 
              textDecoration: 'underline' 
            }}>click here</a>.
          </p>
        </div>
      
        {/* CSS Animations */}
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @keyframes bounceIn {
              0% {
                transform: scale(0.9);
              }
              50% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(1);
              }
            }
          `}
        </style>
      </div>
      
  );
};
export default VerificationSuccess;