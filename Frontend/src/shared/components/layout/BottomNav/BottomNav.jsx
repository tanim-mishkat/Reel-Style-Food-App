import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../../routes/routeConfig";
import styles from "./BottomNav.module.css";

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className={styles.bottomNav}>
      <Link 
        to={ROUTES.HOME} 
        className={`${styles.navItem} ${location.pathname === ROUTES.HOME ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z"/>
        </svg>
        <span>Home</span>
      </Link>
      
      <Link 
        to={ROUTES.SAVED} 
        className={`${styles.navItem} ${location.pathname === ROUTES.SAVED ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2zm-7 13.97l-4.21 1.81.39-4.65L4.52 11l4.75-.39L12 6.1l2.73 4.51L19.48 11l-3.66 3.13.39 4.65L12 16.97z"/>
        </svg>
        <span>Saved</span>
      </Link>
      
      <Link 
        to="/following" 
        className={`${styles.navItem} ${location.pathname === '/following' ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99l-2.98 3.67a.5.5 0 0 0 .39.84H14v6h6zm-11.5 0v-4.5h1.5v3H12V7a2 2 0 0 0-2-2H6c-1.1 0-2 .9-2 2v13.5h4.5z"/>
        </svg>
        <span>Following</span>
      </Link>
      
      <Link 
        to={ROUTES.USER_DASHBOARD} 
        className={`${styles.navItem} ${location.pathname === ROUTES.USER_DASHBOARD ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
        <span>Dashboard</span>
      </Link>
    </nav>
  );
};

export default BottomNav;