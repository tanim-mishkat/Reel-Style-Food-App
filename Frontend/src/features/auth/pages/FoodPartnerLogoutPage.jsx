import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../shared/services/api";
import { ROUTES } from "../../../routes/routeConfig";
import utils from "../../../shared/components/ui/Utils.module.css";

const FoodPartnerLogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await authService.logoutFoodPartner();
      } catch (err) {
        // Handle error silently
      } finally {
        navigate(ROUTES.FOOD_PARTNER_LOGIN);
      }
    };
    logout();
  }, [navigate]);

  return (
    <div className={utils.centerPadding}>
      <p>Logging out...</p>
    </div>
  );
};

export default FoodPartnerLogoutPage;
