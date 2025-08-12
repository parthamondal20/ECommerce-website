import React from "react";
import './Footer.css'
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>My Shop</h3>
        <p>Your one-stop shop for everything!</p>
      </div>

      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to="/myAccount/orders">Orders</Link>
          </li>
          <li>
            <Link to="/myCart">Cart</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Contact</h4>
        <p>Email: parthamondal@myshop.com</p>
        <p>Phone: +91 98765 43210</p>
      </div>
    </footer>
  );
}
export default Footer;
