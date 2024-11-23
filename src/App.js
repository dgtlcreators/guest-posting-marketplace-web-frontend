

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

const Verification = lazy(() => import('./components/auth/VerificationSuccess.js'));

// Lazy-loaded Components
const Login = lazy(() => import('./components/auth/Login.js'));
const Signup = lazy(() => import('./components/auth/Signup.js'));
const Home = lazy(() => import('./components/Home.js'));
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
  return !(location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/notfound" || location.pathname === "/verification-success")

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
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

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


              <Route path="/verification-success" element={<Verification />} />
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


