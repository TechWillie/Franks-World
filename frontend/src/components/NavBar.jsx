import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
// import LoginFormModal from "./LoginFormModal";
// import SignupFormModal from "./SignupFormModal";
import { FaRegUser } from "react-icons/fa6";
import { BsFillHouseFill, BsPersonVcard, BsPersonWalking } from "react-icons/bs";
import "../components/NavBar.css"
import { logout } from "../store/session";

function Navbar({loginClick, signupClick}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [showSignupModal, setShowSignupModal] = useState(false);
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
        <li><NavLink to="/events" >Events</NavLink></li>
        <li><NavLink to="/messages" >Chatter Box</NavLink></li>
        <li><NavLink to="/peeps" >My Peeps</NavLink></li>

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
                  <button onClick={loginClick}><FaRegUser /> Login</button>
                  {/* {showLoginModal && (
                    <LoginFormModal onClose={() => setShowLoginModal(false)}/>
                  )} */}
                  <button onClick={signupClick}><BsPersonVcard /> Signup</button>
                  {/* {showSignupModal && (
                    <SignupFormModal onClose={() => setShowSignupModal(false)}/>
                  )} */}
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