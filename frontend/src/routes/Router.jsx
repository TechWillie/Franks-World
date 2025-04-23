// src/routes/Router.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AFewPeople from '../pages/AFewPeople';
// import ChatBox from '../components/ChatBox';


const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/peeps" element={<AFewPeople />} />
  </Routes>
);

export default Router;
