// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

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
import EditInstagramInfluencer from "./components/InstgramInfluencer/EditInstagramInfluencer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BrandUser from './components/InstgramInfluencer/BrandUser';
import ApplicationForm from './components/InstgramInfluencer/ApplicationForm';
import InfluencerProfile from './components/InstgramInfluencer/InfluencerProfile';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const useShowNavbarAndSidebar = () => {
  const location = useLocation();
  return !(location.pathname === "/login" || location.pathname === "/signup");
};

function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

function AppContent() {
  const showNavbarAndSidebar = useShowNavbarAndSidebar();
  return (
    <div className="flex flex-col h-screen">
      {showNavbarAndSidebar && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {showNavbarAndSidebar && <Sidebar />}
        <main className="flex-1 overflow-y-auto p-4">
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
        </main>
      </div>
    </div>
  );
}

export default App;



















/*import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

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
import EditInstagramInfluencer from "./components/InstgramInfluencer/EditInstagramInfluencer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BrandUser from './components/InstgramInfluencer/BrandUser';
import ApplicationForm from './components/InstgramInfluencer/ApplicationForm';
import InfluencerProfile from './components/InstgramInfluencer/InfluencerProfile';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const options = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  // Fully customizable with appearance API.
  appearance: {
   
  },
};
const useShowNavbarAndSidebar = () => {
  const location = useLocation();
  return !(location.pathname === "/login" || location.pathname === "/signup");
};

function App() {
  const showNavbarAndSidebar = useShowNavbarAndSidebar();
  return (
    <>
      <ToastContainer/>
      <UserProvider>
        <BrowserRouter>
          <div className="flex flex-col h-screen">
          {showNavbarAndSidebar && <Navbar />}
            <div className="flex flex-1 overflow-hidden">
            {showNavbarAndSidebar && <Sidebar />}
              <main className="flex-1 overflow-y-auto p-4">
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
              </main>
            </div>
          </div>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;*/














/*import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

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
    </div>*///}
   /* <div className="flex justify-center h-screen w-screen">
      

      <UserProvider>
        <BrowserRouter>
        <Navbar/>
        <div className="mt-16">
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
          </div>
        </BrowserRouter>
      
        
      </UserProvider>
    </div>
    </>
  );
}

export default App;*/
