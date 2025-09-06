import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>Home</span>
      </Link>
      <Link to="/saved" className={`nav-item ${location.pathname === "/saved" ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
        <span>Saved</span>
      </Link>
    </div>
  );
};

export default BottomNav;