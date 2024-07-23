// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Form from './components/Form';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Admin from './components/Admin';
import { UserProvider } from './context/userContext';
import PathNotFound from './components/PathNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdmin from './components/SuperAdmin';
import EditAdminData from './components/EditAdminData';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import InstagramInfluencer from './components/InstgramInfluencer/InstagramInfluencer';
import EditInstagramInfluencer from "./components/InstgramInfluencer/EditInstagramInfluencer"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import  BrandUser  from './components/InstgramInfluencer/BrandUser';
import ApplicationForm from './components/InstgramInfluencer/ApplicationForm';
import InfluencerProfile from './components/InstgramInfluencer/InfluencerProfile';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const options = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};
console.log(process.env.REACT_APP_STRIPE_PUBLIC_KEY,stripePromise)

function App() {
  return (
    <>
    <ToastContainer/>
     {/*<div className='flex container mt-8'>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>*/}
    <div className="flex justify-center h-screen w-screen">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/form" />} />
            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <Elements stripe={stripePromise}>
                  <Form />
                </Elements>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute>
                  <SuperAdmin />
                </ProtectedRoute>
              }
            />
            <Route path="/editadmindata/:id" element={<EditAdminData />} />
            <Route path="*" element={<PathNotFound />} />
            <Route
              path="/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              }
            />
              <Route
              path="/instagramInfluencer"
              element={
                <ProtectedRoute>
                  <InstagramInfluencer />
                </ProtectedRoute>
              }
            />
             <Route path="/editInstagramInfluencer/:id" element={<EditInstagramInfluencer />} />
             <Route path="/branduser" element={<BrandUser />} />
             <Route path="/application" element={<ApplicationForm />} />
             <Route path="/influencerprofile/:id" element={<InfluencerProfile/>} />
          </Routes>
        </BrowserRouter>
      
        
      </UserProvider>
    </div>
    </>
  );
}

export default App;














/*import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Form from "./components/Form.js";
import Login from "./components/auth/Login.js";
import Signup from "./components/auth/Signup.js";
import Admin from "./components/Admin.js";
import { UserProvider } from "./context/userContext.js";
import PathNotFound from "./components/PathNotFound.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import SuperAdmin from "./components/SuperAdmin.js";
import EditAdminData from "./components/EditAdminData.js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm.js'; 


const REACT_APP_STRIPE_PUBLIC_KEY="pk_test_51Pc5s4BoSkOFO1ztKnZ79iNVLUQPo5dPHfJbQMg0sZmdivTQ3T8v8L5SCvP9d7ItOfeVHH6KMKmpu2AUfwp9YEOI00IxTpaPSG"
const stripePromise =REACT_APP_STRIPE_PUBLIC_KEY
//process.env.REACT_APP_STRIPE_PUBLIC_KEY;
console.log(stripePromise)
//REACT_APP_STRIPE_PUBLIC_KEY="pk_test_51Pc5s4BoSkOFO1ztKnZ79iNVLUQPo5dPHfJbQMg0sZmdivTQ3T8v8L5SCvP9d7ItOfeVHH6KMKmpu2AUfwp9YEOI00IxTpaPSG"


function App() {
  return (
    <>
     
    <div className="flex justify-center h-screen w-screen">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/form" />} />
            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <Form />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute>
                  <SuperAdmin />
                </ProtectedRoute>
              }
            />
            <Route path="/editadmindata/:id" element={<EditAdminData />} />
            <Route path="*" element={<PathNotFound />} />
            <Route
              path="/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
    </>
  );
}

export default App; */