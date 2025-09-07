import React from "react";
import { useCart } from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  if (itemCount === 0) return null;

  return (
    <div 
      onClick={() => navigate("/checkout")}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#16a34a",
        color: "white",
        padding: "10px 15px",
        borderRadius: "25px",
        cursor: "pointer",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}
    >
      🛒 {itemCount} items - ${subtotal.toFixed(2)}
    </div>
  );
};

export default CartIcon;