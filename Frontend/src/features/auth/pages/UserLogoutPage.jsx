import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../shared/services/api";
import { ROUTES } from "../../../routes/routeConfig";

const UserLogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await authService.logoutUser();
      } catch (err) {
        // Handle error silently
      } finally {
        navigate(ROUTES.HOME);
      }
    };
    logout();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p>Logging out...</p>
    </div>
  );
};

export default UserLogoutPage;