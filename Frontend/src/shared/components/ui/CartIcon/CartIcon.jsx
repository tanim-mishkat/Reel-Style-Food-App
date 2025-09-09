import React from "react";
import useCart from "../../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import styles from "./CartIcon.module.css";

const CartIcon = () => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  if (itemCount === 0) return null;

  return (
    <div
      className={styles.cart}
      onClick={() => navigate("/checkout")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate("/checkout")}
    >
      🛒 {itemCount} items - ${subtotal.toFixed(2)}
    </div>
  );
};

export default CartIcon;
