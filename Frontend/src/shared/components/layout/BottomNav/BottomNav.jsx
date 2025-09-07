import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { ROUTES } from "../../../../routes/routeConfig";
import styles from "./BottomNav.module.css";

const BottomNav = () => {
  const location = useLocation();
  const { items } = useCart();

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
        to={ROUTES.CHECKOUT} 
        className={`${styles.navItem} ${location.pathname === ROUTES.CHECKOUT ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
        </svg>
        <span>Cart</span>
        {items.length > 0 && (
          <div className={styles.cartBadge}>{items.length}</div>
        )}
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
        to={ROUTES.SAVED} 
        className={`${styles.navItem} ${location.pathname === ROUTES.SAVED ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
        <span>Saved</span>
      </Link>
      
      <Link 
        to={ROUTES.USER_DASHBOARD} 
        className={`${styles.navItem} ${location.pathname === ROUTES.USER_DASHBOARD ? styles.active : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H13.5L19 8.5V9H21ZM7 13C8.1 13 9 13.9 9 15S8.1 17 7 17 5 16.1 5 15 5.9 13 7 13ZM17 13C18.1 13 19 13.9 19 15S18.1 17 17 17 15 16.1 15 15 15.9 13 17 13Z"/>
        </svg>
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;