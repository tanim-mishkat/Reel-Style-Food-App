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
    </nav>
  );
};

export default BottomNav;