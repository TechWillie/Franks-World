import { NavLink } from "react-router-dom";


import "../components/NavBar.css"
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSessionUser } from "../store/session";



function Navbar() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  // const [showMenu, setShowMenu] = useState(false);




  return (
    < nav className="navbar">
      <h2 className="logo">Franks World</h2>
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/peeps" >My Peeps</NavLink></li>
        <li><NavLink to="" >Chatter Box</NavLink></li>

    {sessionUser ? (
          <li>
            <button onClick={() => dispatch(setSessionUser(null))}>Logout</button>
          </li>
        ) : (
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;