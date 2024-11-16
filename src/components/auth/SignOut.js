import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.js';

const SignOut = () => {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUserData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;
