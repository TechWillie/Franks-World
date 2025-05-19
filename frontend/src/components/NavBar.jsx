import { NavLink } from "react-router-dom";
import Home from "../pages/Home";
import AFewPeople from "../pages/AFewPeople";
import "../components/NavBar.css"


function Navbar() {
  return (
    < nav className="navbar">
      <h2 className="logo">Franks World</h2>
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/peeps" >My Peeps</NavLink></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;