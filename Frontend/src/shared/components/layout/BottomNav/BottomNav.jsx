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
        to={ROUTES.USER_ORDERS} 
        className={`${styles.navItem} ${location.pathname === ROUTES.USER_ORDERS ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
        </svg>
        <span>Orders</span>
      </Link>
    </nav>
  );
};

export default BottomNav;