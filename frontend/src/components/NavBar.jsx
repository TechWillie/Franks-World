import { NavLink } from "react-router-dom";
import "../components/NavBar.css"
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSessionUser } from "../store/session";
import { FaRegUser } from "react-icons/fa6";
import LoginFormModal from "./LoginFormModal";
import { useState, useRef, useEffect } from "react";
import SignupFormModal from "./SignupFormModal";
import { BsFillHouseFill, BsPersonVcard, BsPersonWalking } from "react-icons/bs";
import { logout } from "../store/session";

function Navbar() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const dropDownMenu = useRef();
  
   // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownMenu.current && !dropDownMenu.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  
  return (
    <nav className="navbar">
      <h2 className="logo">theHype</h2>
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/peeps" >My Peeps</NavLink></li>
        <li><NavLink to="/messages" >Chatter Box</NavLink></li>

    {sessionUser ? (
          <li>
            <button onClick={() => dispatch(logout())}><BsPersonWalking /> Logout</button>
          </li>
        ) : (
          <li>
            <div ref={dropDownMenu} style={{ position: 'relative' }}>
              <button onClick={() => setShowMenu(!showMenu)}><BsFillHouseFill /> Please come in...</button>
              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => setShowLoginModal(true)}><FaRegUser /> Login</button>
                  {showLoginModal && (
                    <LoginFormModal onClose={() => setShowLoginModal(false)}/>
                  )}
                  <button onClick={() => setShowSignupModal(true)}><BsPersonVcard /> Signup</button>
                  {showSignupModal && (
                    <SignupFormModal onClose={() => setShowSignupModal(false)}/>
                  )}
                </div>
              )}
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;