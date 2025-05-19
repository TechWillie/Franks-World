// src/routes/Router.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import AFewPeople from '../pages/AFewPeople';
import Navbar from '../components/NavBar';
// import ChatBox from '../components/ChatBox';

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
    </Route>
  </Routes>
);

export default Router;
