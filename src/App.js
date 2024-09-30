// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NotificationsPage from './components/Notifications/NotificationsPage.js';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

import { UserProvider } from './context/userContext';
import ProtectedRoute from './components/ProtectedRoute';

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
import EditInstagramInfluencer from "./components/InstgramInfluencer/EditInstagramInfluencer";
import InfluencerProfile from './components/InstgramInfluencer/InfluencerProfile';
import ApplicationForm from './components/InstgramInfluencer/ApplicationForm';

import YoutubeInfluencer from './components/YoutubeInfluencer/YoutubeInfluencer.js';
import NewYoutubeInfluencer from './components/YoutubeInfluencer/NewYoutubeInfluencer.js';
import EditYoutubeInfluencer from './components/YoutubeInfluencer/EditYoutubeInfluencer.js';
import YoutubeInfluencerProfile from './components/YoutubeInfluencer/YoutubeInfluencerProfile.js';

import ContentWriter from "./components/ContentWriter/ContentWriter.js"
import NewContentWriter from "./components/ContentWriter/NewContentWriter.js"
import EditContentWriter from "./components/ContentWriter/EditContentWriter.js"
import ContentWriterProfile from "./components/ContentWriter/ContentWriterProfile.js"

import ReportAndApplications from './components/ReportAndApplications';
import Dashboard from './components/dashboardItems/Dashboard';
import PathNotFound from './components/PathNotFound';
import PastActivities from './components/OtherComponents/PastActivities';
import CheckoutForm from './CheckoutForm';
import MyLists from './components/MyLists/MyLists.js';
import ProfileSettings from './components/ProfileSettings.js';




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
  // console.log(process.env.Local_Url)
  return (
    <div className="flex flex-col h-screen">
      {showNavbarAndSidebar && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {showNavbarAndSidebar && <Sidebar />}
       {/* <button disabled title="I am Disabled Right Now">I am Disabled</button>*/}
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>

            {/**Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/**Super Admin Routes */}
            <Route path="/superadmin" element={<ProtectedRoute requiredRoles={["Super Admin"]}><Superadmin /></ProtectedRoute>} />
            <Route path="/addSuperadmin" element={<ProtectedRoute requiredRoles={["Super Admin"]}><NewsuperAdmin /></ProtectedRoute>} />
            <Route path="/editsuperadmin/:id" element={<ProtectedRoute requiredRoles={["Super Admin"]}><EditSuperadmin /> </ProtectedRoute>} />
            <Route path="/superadminProfile/:id" element={<ProtectedRoute requiredRoles={["Super Admin"]}><SuperadminProfile /></ProtectedRoute>} />

            {/*GuestPost*/}
            <Route path="/" element={<Navigate to="/guestpost" />} />
            <Route path="/guestpost" element={<ProtectedRoute><Elements stripe={stripePromise}>
              <Guestpost />
            </Elements></ProtectedRoute>} />
            <Route path="/addGuestpost" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}><NewGuestpost /></ProtectedRoute>} />
            <Route path="/editguestpostdata/:id" element={<ProtectedRoute><EditGuestpostData /> </ProtectedRoute>} />
            <Route path="/guestpostProfile/:id" element={<GuestPostProfile />} />
            

            
            {/**Instagram Routes */}
            <Route path="/instagram-influencer" element={<InstagramInfluencer />} />
            <Route path="/addInstagramInfluencer" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]} >
              <NewInstagramInfluencer /></ProtectedRoute>} />
            <Route path="/editInstagramInfluencer/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <EditInstagramInfluencer /> </ProtectedRoute>} />
            <Route path="/influencerprofile/:id" element={<InfluencerProfile />} />

            {/**Youtube Routes */}
            <Route path='/youtube-influencer' element={<YoutubeInfluencer />} />
            <Route path='/addYoutubeInfluencer' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <NewYoutubeInfluencer /></ProtectedRoute>} />
            <Route path='/edityoutubeInfluencer/:id' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <EditYoutubeInfluencer /></ProtectedRoute>} />
            <Route path='/youtubeInfluencerProfile/:id' element={<YoutubeInfluencerProfile />} />

            {/**Content writer Routes */}
            <Route path="/content-writers" element={<ContentWriter />} />
            <Route path='/addContentWriters' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <NewContentWriter /></ProtectedRoute>} />
            <Route path="/editContentWriter/:id" element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
              <EditContentWriter /> </ProtectedRoute>} />
            <Route path="/contentWriterprofile/:id" element={<ContentWriterProfile />} />




            {/**Other Routes */}
            <Route path="/past-activities" element={<PastActivities />} />
            <Route path="/application" element={<ApplicationForm />} />
            <Route path='/reports-applications' element={<ProtectedRoute requiredRoles={["Super Admin", "Admin"]}>
            <ReportAndApplications /></ProtectedRoute>} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<PathNotFound />} />

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

