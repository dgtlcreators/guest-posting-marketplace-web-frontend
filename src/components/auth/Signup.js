 
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
 


/**
 * 
 * 


import { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.js";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout.js";
import { useTheme } from "../../context/ThemeProvider.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const { isDarkTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserData ,localhosturl} = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");



  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please check and try again.");
      return; 
    }

    axios
    
     .post(`${localhosturl}/user/signup`, { name, email, password,confirmPassword })
     
      .then((response) => {
        toast.success("Signed up successfully. Please check your email to verify your account.")
        console.log("signup User ",response.data.user)
        setUserData(response.data.user);
        navigate("/guestpost");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
  };

  return (
    <Layout isRegisterPage={true}>
      <div className={`w-full max-w-md mx-auto  p-8 rounded-lg shadow-2xl space-y-8${isDarkTheme ? "bg-gray-800" : "bg-gray-100"}`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-bold  ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
             <div className="relative" >
             <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
            
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 ${isDarkTheme ? "border-gray-600 text-gray-100" : "border-gray-300 text-gray-900"} text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
             </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
              Confirm Password
              </label>
             <div className="relative" >
             <input
               id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
 
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 ${isDarkTheme ? "border-gray-600 text-gray-100" : "border-gray-300 text-gray-900"} text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  sm:text-sm`}
                 placeholder="Re-enter Password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
              />
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
             </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>

          <div className="flex justify-around">
            <span className="">Are you already a user?</span>
            <Link
              to="/login"
              className="group relative flex justify-center py-1 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Signup;
 */