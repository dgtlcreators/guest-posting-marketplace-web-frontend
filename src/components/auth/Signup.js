 
import React, { useContext, useState } from 'react';
import './signup.css';
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.js";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeProvider.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Signup() {
  const [accessCode, setAccessCode] = useState('');
  const [isValidCode, setIsValidCode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData ,localhosturl} = useContext(UserContext);

  const navigate = useNavigate();


  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
  };

  const handleAccessCodeSubmit = (e) => {
    e.preventDefault();

    if (accessCode === 'ACCESS123') {
      setIsValidCode(true); 
    } else {
      alert('Invalid access code! Please try again.');
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
  //  if (password !== confirmPassword) {
    //  toast.error("Passwords do not match. Please check and try again.");
   //   return; 
  //  }
const name=username
    axios
     .post(`${localhosturl}/user/signup`, { name, email, password})
      .then((response) => {
        toast.success("Signed up successfully. Please check your email to verify your account.")
        console.log("signup User ",response.data.user)
        setUserData(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
    //alert('Sign-up successful!');
  };

  return (
    <div className="signup-page">
    <div className="signup-container">
      <div className="signup-box">
        <h1>Sign Up</h1>

        {!isValidCode ? (
          <form onSubmit={handleAccessCodeSubmit}>
            <p>Please enter the access code to proceed</p>
            <input
              type="text"
              placeholder="Enter Access Code"
              value={accessCode}
              onChange={handleAccessCodeChange}
              required
            />
            <button type="submit" disabled={!accessCode}>
              Proceed to Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit}>
            <p>Create your account</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        )}

        <div className="access-code-link">
          <p>
            If you need an access code, please{' '}
            <a href="https://example.com/contact" target="_blank" rel="noopener noreferrer">
              contact us here
            </a>.
          </p>
        </div>
      </div>
    </div>
    </div>
  );

};

export default Signup;
