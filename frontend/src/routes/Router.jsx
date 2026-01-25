// src/routes/Router.jsx
import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import AFewPeople from '../pages/MyPeeps';
import Navbar from '../components/NavBar';
// import ChatBox from '../components/ChatBox';
import Messages from '../pages/Messages';
import Events from '../pages/Events';
import LoginFormModal from '../components/LoginFormModal';
import SignupFormModal from '../components/SignupFormModal';
import TestInput from "../pages/TestInput";



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
    </Route>
  </Routes>
);

export default Router;
