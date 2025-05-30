// src/routes/Router.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import AFewPeople from '../pages/MyPeeps';
import Navbar from '../components/NavBar';
// import ChatBox from '../components/ChatBox';
import Messages from '../pages/Messages';

const MainLayout = () => (
  <div>
    <Navbar />
    <Outlet />
  </div>
);

const Router = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/peeps" element={<AFewPeople />} />
      <Route path="/messages" element={<Messages />} />
    </Route>
  </Routes>
);

export default Router;
