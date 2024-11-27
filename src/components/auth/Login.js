
import './login.css';
import React from 'react';
import axios from "axios";
import { useContext, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.js";
import { toast } from "react-toastify";

import { useTheme } from "../../context/ThemeProvider.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";



function Login() {

  const { isDarkTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserData, localhosturl } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${localhosturl}/user/login`, { email, password })
      .then((response) => {
        const user = response.data.user;
        if (!user.isVerified) {
          toast.error("Please verify your email to log in.");
          return;
        }
        toast.success("Logged in successfully");
        console.log("response.data.user Login ", response.data.user);
        setUserData(response.data.user);
        navigate("/")
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        console.log(error);
      });
  };


  return (
    <div className="login-page">
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p>Log in to access your dashboard</p>
        <form onSubmit={handleSubmit}>
          <input
            id="email-address"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
          />
          <input
            id="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
          />
          <button type="submit"
            onClick={() => setShowPassword((prev) => !prev)}
          >Log In</button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
    </div>
  );

};

export default Login;
