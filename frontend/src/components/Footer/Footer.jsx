import { NavLink } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          Welcome to the Hype
        </div>

        <nav className="footer-links">
          <NavLink to="/privacy">Privacy Policy</NavLink>
          <NavLink to="/terms">Terms</NavLink>
          <NavLink to="/support">Contact & Support</NavLink>
          <NavLink to="/delete-account">Delete Account</NavLink>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;