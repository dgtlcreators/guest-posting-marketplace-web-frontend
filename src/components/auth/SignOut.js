import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const SignOut = () => {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUserData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // If you have a token stored
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;
