import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService, foodPartnerService } from "../../../services/api";
import NotificationBell from "../../ui/NotificationBell/NotificationBell";
import useRealtime from "../../../hooks/useRealtime";
import LogoutModal from "../../ui/LogoutModal/LogoutModal";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      // Try to get user profile first
      try {
        const userResponse = await authService.getUserProfile();
        setUser(userResponse.data.user);
        setPartner(null);
      } catch (userError) {
        // If user auth fails, try partner auth
        try {
          const partnerResponse = await foodPartnerService.getMyProfile();
          setPartner(partnerResponse.data.foodPartner);
          setUser(null);
        } catch (partnerError) {
          // Neither auth worked - this is normal for logged out users
          setUser(null);
          setPartner(null);
        }
      }
    } catch (error) {
      // Silent fail - normal for unauthenticated users
      setUser(null);
      setPartner(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      if (user) {
        await authService.logoutUser();
      } else if (partner) {
        await authService.logoutFoodPartner();
      }

      setUser(null);
      setPartner(null);
      setShowLogoutModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const isAuthenticated = user || partner;

  // Connect socket as soon as we know who is logged in
  useRealtime(user ? "user" : partner ? "partner" : null);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <Link to="/" className={styles.brand}>
          <div className={styles.logo}>
            <img src="/reelivery_logo.jpg" alt="Reelivery Logo" />
          </div>
          <span className={styles.brandText}>FoodReels</span>
        </Link>

        {/* Right Side Actions */}
        <div className={styles.rightActions}>
          {/* Notification Bell */}
          {isAuthenticated && (
            <div className={styles.navbarNotifications}>
              <NotificationBell
                role={user ? "user" : partner ? "partner" : null}
              />
            </div>
          )}

          {/* Logout/Login Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogoutClick}
              className={styles.logoutButton}
              aria-label="Logout"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </button>
          ) : (
            <Link to="/auth/user/login" className={styles.loginButton}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </nav>
  );
};

export default Navbar;
