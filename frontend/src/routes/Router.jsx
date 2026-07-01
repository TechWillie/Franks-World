// src/routes/Router.jsx
import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import AFewPeople from '../pages/MyPeeps';
import Navbar from '../components/NavBar';
// import ChatBox from '../components/ChatBox';
import Messages from '../pages/Messages';
import Events from '../pages/Events';
import LoginFormModal from '../components/login signup/LoginFormModal';
import SignupFormModal from '../components/login signup/SignupFormModal';
import TestInput from "../pages/TestInput";

import PrivacyPolicy from '../pages/PrivacyPolicy.jsx';
import Terms from '../pages/Terms.jsx';
import Support from '../pages/Support.jsx';
import DeleteAccount from '../pages/DeleteAccount.jsx';

import Footer from "../components/Footer/Footer.jsx";



const MainLayout = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    return (
  <div>
    <Navbar loginClick={() => setShowLogin(true)} 
    signupClick={() => setShowSignup(true)} />
    <LoginFormModal show={showLogin} onClose={() => setShowLogin(false)} />
    <SignupFormModal show={showSignup} onClose={() => setShowSignup(false)} />
    <Outlet />
    <Footer />
  </div>
  );
};

const Router = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/peeps" element={<AFewPeople />} />
      <Route path="/messages" element={<Messages />} />
      <Route path='/events' element={<Events />} />
      <Route path="/test" element={<TestInput />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/support" element={<Support />} />
      <Route path="/delete-account" element={<DeleteAccount />} />
    </Route>
  </Routes>
);

export default Router;
