

// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Context and Providers
import { UserProvider } from './context/userContext.js';

// Components
import Navbar from "./components/Navbar.js";
import Sidebar from "./components/Sidebar.js";
import ProtectedRoute from './components/ProtectedRoute.js';

// Lazy-loaded Components
const Login = () => import('./components/auth/Login.js');
const Signup = lazy(() => import('./components/auth/Signup.js'));
const Dashboard = lazy(() => import('./components/dashboardItems/Dashboard.js'));
const Guestpost = lazy(() => import('./components/GuestPosts/Guestpost.js'));
const EditGuestpostData = lazy(() => import('./components/GuestPosts/EditAdminData.js'));
const NewGuestpost = lazy(() => import('./components/GuestPosts/NewGuestpost.js'));
const GuestPostProfile = lazy(() => import('./components/GuestPosts/GuestPostProfile.js'));

const Superadmin = lazy(() => import('./components/SuperAdmin/Superadmin.js'));
const NewsuperAdmin = lazy(() => import('./components/SuperAdmin/NewsuperAdmin.js'));
const EditSuperadmin = lazy(() => import('./components/SuperAdmin/EditSuperadmin.js'));
const SuperadminProfile = lazy(() => import('./components/SuperAdmin/SuperadminProfile.js'));

const InstagramInfluencer = lazy(() => import('./components/InstgramInfluencer/InstagramInfluencer.js'));
const NewInstagramInfluencer = lazy(() => import('./components/InstgramInfluencer/NewInstagramInfluencer.js'));
const EditInstagramInfluencer = lazy(() => import('./components/InstgramInfluencer/EditInstagramInfluencer.js'));
const InfluencerProfile = lazy(() => import('./components/InstgramInfluencer/InfluencerProfile.js'));

const YoutubeInfluencer = lazy(() => import('./components/YoutubeInfluencer/YoutubeInfluencer.js'));
const NewYoutubeInfluencer = lazy(() => import('./components/YoutubeInfluencer/NewYoutubeInfluencer.js'));
const EditYoutubeInfluencer = lazy(() => import('./components/YoutubeInfluencer/EditYoutubeInfluencer.js'));
const YoutubeInfluencerProfile = lazy(() => import('./components/YoutubeInfluencer/YoutubeInfluencerProfile.js'));

const ContentWriter = lazy(() => import('./components/ContentWriter/ContentWriter.js'));
const NewContentWriter = lazy(() => import('./components/ContentWriter/NewContentWriter.js'));
const EditContentWriter = lazy(() => import('./components/ContentWriter/EditContentWriter.js'));
const ContentWriterProfile = lazy(() => import('./components/ContentWriter/ContentWriterProfile.js'));

const NotificationsPage = lazy(() => import('./components/Notifications/NotificationsPage.js'));
const ReportAndApplications = lazy(() => import('./components/ReportAndApplications.js'));
const PastActivities = lazy(() => import('./components/OtherComponents/PastActivities.js'));
const ApplicationForm = lazy(() => import('./components/InstgramInfluencer/ApplicationForm.js'));
const ProfileSettings = lazy(() => import('./components/ProfileSettings.js'));
const MyLists = lazy(() => import('./components/MyLists/MyLists.js'));
const CheckoutForm = lazy(() => import('./CheckoutForm.js'));
const PathNotFound = lazy(() => import('./components/PathNotFound.js'));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const useShowNavbarAndSidebar = () => {
  const location = useLocation();
  return !(location.pathname === "/login" || location.pathname === "/Signup101010" || location.pathname === "/notfound");
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/Signup101010" element={<Signup />} />

              {/* Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Guest Posts */}
              <Route path="/guestpost" element={<ProtectedRoute><Guestpost /></ProtectedRoute>} />
              <Route path="/addGuestpost" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><NewGuestpost /></ProtectedRoute>} />
              <Route path="/editguestpostdata/:id" element={<ProtectedRoute  requiredRoles={["Super Admin", "Admin"]}><EditGuestpostData /></ProtectedRoute>} />
              <Route path="/guestpostProfile/:id" element={<ProtectedRoute><GuestPostProfile /></ProtectedRoute>} />

              {/* Super Admin */}
              <Route path="/superadmin" element={<ProtectedRoute requiredRoles={["Super Admin"]}><Superadmin /></ProtectedRoute>} />
              <Route path="/addSuperadmin" element={<ProtectedRoute requiredRoles={["Super Admin"]}><NewsuperAdmin /></ProtectedRoute>} />
              <Route path="/editsuperadmin/:id" element={<ProtectedRoute requiredRoles={["Super Admin"]}><EditSuperadmin /></ProtectedRoute>} />
              <Route path="/superadminProfile/:id" element={<ProtectedRoute requiredRoles={["Super Admin"]}><SuperadminProfile /></ProtectedRoute>} />

              {/* Instagram Influencer */}
              <Route path="/instagram-influencer" element={<ProtectedRoute><InstagramInfluencer /></ProtectedRoute>} />
              <Route path="/addInstagramInfluencer" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><NewInstagramInfluencer /></ProtectedRoute>} />
              <Route path="/editInstagramInfluencer/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><EditInstagramInfluencer /></ProtectedRoute>} />
              <Route path="/influencerprofile/:id" element={<ProtectedRoute><InfluencerProfile /></ProtectedRoute>} />

              {/* YouTube Influencer */}
              <Route path="/youtube-influencer" element={<ProtectedRoute><YoutubeInfluencer /></ProtectedRoute>} />
              <Route path="/addYoutubeInfluencer" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><NewYoutubeInfluencer /></ProtectedRoute>} />
              <Route path="/editYoutubeInfluencer/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><EditYoutubeInfluencer /></ProtectedRoute>} />
              <Route path="/youtubeInfluencerProfile/:id" element={<ProtectedRoute><YoutubeInfluencerProfile /></ProtectedRoute>} />

              {/* Content Writer */}
              <Route path="/content-writers" element={<ProtectedRoute><ContentWriter /></ProtectedRoute>} />
              <Route path="/addContentWriters" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><NewContentWriter /></ProtectedRoute>} />
              <Route path="/editContentWriter/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><EditContentWriter /></ProtectedRoute>} />
              <Route path="/contentWriterprofile/:id" element={<ProtectedRoute><ContentWriterProfile /></ProtectedRoute>} />

              {/* Other Pages */}
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/past-activities" element={<ProtectedRoute><PastActivities /></ProtectedRoute>} />
              <Route path="/application" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
              <Route path="/reports-applications" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><ReportAndApplications /></ProtectedRoute>} />
              <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
              <Route path="/my-lists" element={<ProtectedRoute><MyLists /></ProtectedRoute>} />

              {/* Stripe Checkout */}
              <Route path="/checkout" element={<ProtectedRoute><Elements stripe={stripePromise}><CheckoutForm /></Elements></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/notfound" />} />
              <Route path="/notfound" element={<PathNotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;












/*
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



import Navbar from "./components/Navbar.js";
import Sidebar from "./components/Sidebar.js";
import NotificationsPage from './components/Notifications/NotificationsPage.js';

import Login from './components/auth/Login.js';
import Signup from './components/auth/Signup.js';

import { UserProvider } from './context/userContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';

import Guestpost from './components/GuestPosts/Guestpost.js';
import EditGuestpostData from './components/GuestPosts/EditAdminData.js';
import GuestPostProfile from './components/GuestPosts/GuestPostProfile.js';
import NewGuestpost from './components/GuestPosts/NewGuestpost.js';

import Superadmin from './components/SuperAdmin/Superadmin.js';
import NewsuperAdmin from './components/SuperAdmin/NewsuperAdmin.js';
import EditSuperadmin from './components/SuperAdmin/EditSuperadmin.js';
import SuperadminProfile from './components/SuperAdmin/SuperadminProfile.js';

import InstagramInfluencer from './components/InstgramInfluencer/InstagramInfluencer.js';
import NewInstagramInfluencer from './components/InstgramInfluencer/NewInstagramInfluencer.js';
import EditInstagramInfluencer from "./components/InstgramInfluencer/EditInstagramInfluencer.js";
import InfluencerProfile from './components/InstgramInfluencer/InfluencerProfile.js';
import ApplicationForm from './components/InstgramInfluencer/ApplicationForm.js';

import YoutubeInfluencer from './components/YoutubeInfluencer/YoutubeInfluencer.js';
import NewYoutubeInfluencer from './components/YoutubeInfluencer/NewYoutubeInfluencer.js';
import EditYoutubeInfluencer from './components/YoutubeInfluencer/EditYoutubeInfluencer.js';
import YoutubeInfluencerProfile from './components/YoutubeInfluencer/YoutubeInfluencerProfile.js';

import ContentWriter from "./components/ContentWriter/ContentWriter.js"
import NewContentWriter from "./components/ContentWriter/NewContentWriter.js"
import EditContentWriter from "./components/ContentWriter/EditContentWriter.js"
import ContentWriterProfile from "./components/ContentWriter/ContentWriterProfile.js"

import ReportAndApplications from './components/ReportAndApplications.js';
import Dashboard from './components/dashboardItems/Dashboard.js';
import PathNotFound from './components/PathNotFound.js';
import PastActivities from './components/OtherComponents/PastActivities.js';
import CheckoutForm from './CheckoutForm.js';
import MyLists from './components/MyLists/MyLists.js';
import ProfileSettings from './components/ProfileSettings.js';




const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


const isValidRoute = (pathname) => {
  const validRoutes = [
    "/superadmin", "/addSuperadmin", "/editsuperadmin", "/superadminProfile",
    "/guestpost", "/addGuestpost", "/editguestpostdata", "/guestpostProfile",
    "/instagram-influencer", "/addInstagramInfluencer", "/editInstagramInfluencer", "/influencerprofile",
    "/youtube-influencer", "/addYoutubeInfluencer", "/edityoutubeInfluencer", "/youtubeInfluencerProfile",
    "/content-writers", "/addContentWriters", "/editContentWriter", "/contentWriterprofile",
    "/past-activities", "/application", "/reports-applications", "/notifications",
    "/dashboard", "/profile-settings", "/my-lists", "/checkout", "/pathnotfound"
  ];
  
  return validRoutes.some(route => pathname.startsWith(route));
};


const useShowNavbarAndSidebar = () => {
  const location = useLocation();
  console.log("Location ",location)
  //return isValidRoute(location.pathname);
  return !(location.pathname === "/login" || location.pathname === "/signup" || (location.pathname === "*") || location.pathname === "/not-found");
};




function App() {

  useEffect(() => {
    console.log(window.location.pathname); 
  }, []);
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
  // console.log(process.env.Local_Url)
  return (
    <div className="flex flex-col h-screen">
      {showNavbarAndSidebar && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {showNavbarAndSidebar && <Sidebar />}
       {/* <button disabled title="I am Disabled Right Now">I am Disabled</button> end /}
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>

            {/**Auth end /}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/**Super Admin Routes  end /}
            <Route path="/superadmin" element={<ProtectedRoute requiredRoles={["Super Admin"]}><Superadmin /></ProtectedRoute>} />
            <Route path="/addSuperadmin" element={<ProtectedRoute requiredRoles={["Super Admin"]}><NewsuperAdmin /></ProtectedRoute>} />
            <Route path="/editsuperadmin/:id" element={<ProtectedRoute requiredRoles={["Super Admin"]}><EditSuperadmin /> </ProtectedRoute>} />
            <Route path="/superadminProfile/:id" element={<ProtectedRoute requiredRoles={["Super Admin"]}><SuperadminProfile /></ProtectedRoute>} />

            {/*GuestPost end /}
            <Route path="/" element={<Navigate to="/guestpost" />} />
            <Route path="/guestpost" element={<ProtectedRoute><Elements stripe={stripePromise}>
              <Guestpost />
            </Elements></ProtectedRoute>} />
            <Route path="/addGuestpost" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><NewGuestpost /></ProtectedRoute>} />
            <Route path="/editguestpostdata/:id" element={<ProtectedRoute><EditGuestpostData /> </ProtectedRoute>} />
            <Route path="/guestpostProfile/:id" element={<GuestPostProfile />} />
            

            
            {/**Instagram Routes  end /}
            <Route path="/instagram-influencer" element={<InstagramInfluencer />} />
            <Route path="/addInstagramInfluencer" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]} >
              <NewInstagramInfluencer /></ProtectedRoute>} />
            <Route path="/editInstagramInfluencer/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <EditInstagramInfluencer /> </ProtectedRoute>} />
            <Route path="/influencerprofile/:id" element={<InfluencerProfile />} />

            {/**Youtube Routes  end /}
            <Route path='/youtube-influencer' element={<YoutubeInfluencer />} />
            <Route path='/addYoutubeInfluencer' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <NewYoutubeInfluencer /></ProtectedRoute>} />
            <Route path='/edityoutubeInfluencer/:id' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <EditYoutubeInfluencer /></ProtectedRoute>} />
            <Route path='/youtubeInfluencerProfile/:id' element={<YoutubeInfluencerProfile />} />

            {/**Content writer Routes  end /}
            <Route path="/content-writers" element={<ContentWriter />} />
            <Route path='/addContentWriters' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <NewContentWriter /></ProtectedRoute>} />
            <Route path="/editContentWriter/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <EditContentWriter /> </ProtectedRoute>} />
            <Route path="/contentWriterprofile/:id" element={<ContentWriterProfile />} />




            {/**Other Routes  end /}
            <Route path="/past-activities" element={<PastActivities />} />
            <Route path="/application" element={<ApplicationForm />} />
            <Route path='/reports-applications' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
            <ReportAndApplications /></ProtectedRoute>} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
           
            <Route path="/" element={<Navigate to="/not-found" />} />
           
            <Route path="*" element={<PathNotFound  />} />

            <Route path="/profile-settings" element={<ProfileSettings />} />

            <Route path="/my-lists" element={<MyLists />} />

            <Route path="/checkout" element={<Elements stripe={stripePromise}><CheckoutForm /></Elements>} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
*/
