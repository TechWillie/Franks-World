import { Navigate, NavLink, useNavigate } from "react-router-dom";
import "../components/NavBar.css"
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSessionUser } from "../store/session";
import { FaRegUser } from "react-icons/fa6";
import LoginFormModal from "./LoginFormModal";
import { useState, useRef, useEffect } from "react";




function Navbar() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const handleClick = () => {
    return (
     <LoginFormModal />
     
    )
  }

  
  return (
    <nav className="navbar">
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
            <div ref={dropDownMenu}>
              <button onClick={() => setShowMenu(!showMenu)}><FaRegUser /> Please come in...</button>
              {showMenu && (
                <div className="dropdown-menu">
                  <h1>the menu</h1>
                  <button onClick={() => setShowModal(true)}>Login</button>
                  {showModal && (
                    <LoginFormModal onClose={() => setShowModal(false)}/>
                  )}
                  <button onClick={handleClick}>Signup</button>
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