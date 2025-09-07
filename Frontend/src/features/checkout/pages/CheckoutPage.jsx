import React, { useState } from "react";
import { useCart } from "../../../shared/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import Input from "../../../shared/components/ui/Input/Input";
import Button from "../../../shared/components/ui/Button/Button";

const CheckoutPage = () => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");

  const handleContinue = () => {
    if (deliveryType === "delivery" && !address.trim()) {
      alert("Please enter delivery address");
      return;
    }
    navigate("/payment");
  };

  if (items.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-xl)",
        textAlign: "center",
        background: "var(--surface-light)"
      }}>
        <div style={{
          fontSize: "4rem",
          marginBottom: "var(--spacing-lg)",
          opacity: "0.3"
        }}>🛒</div>
        <h2 style={{
          fontSize: "var(--text-h2)",
          fontWeight: "600",
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-sm)"
        }}>Your cart is empty</h2>
        <p style={{
          color: "var(--text-secondary)",
          marginBottom: "var(--spacing-lg)",
          fontSize: "var(--text-body)"
        }}>Discover amazing food videos and start ordering!</p>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "var(--spacing-md) var(--spacing-xl)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-body)",
            fontWeight: "600",
            cursor: "pointer",
            minHeight: "var(--touch-target)",
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)"
          }}
        >
          Start Browsing
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: "var(--spacing-md)", 
      minHeight: "100vh",
      background: "var(--surface-light)"
    }}>
      <div style={{
        padding: "var(--spacing-lg) 0",
        borderBottom: "1px solid var(--border)",
        marginBottom: "var(--spacing-lg)"
      }}>
        <h1 style={{
          fontSize: "var(--text-h1)",
          fontWeight: "700",
          color: "var(--text-primary)",
          margin: "0"
        }}>Checkout</h1>
      </div>
      
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
            <span>{item.name} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem" }}>
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Delivery Options</h3>
        <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="radio"
              value="delivery"
              checked={deliveryType === "delivery"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Delivery
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="radio"
              value="pickup"
              checked={deliveryType === "pickup"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Pickup
          </label>
        </div>
      </div>

      {deliveryType === "delivery" && (
        <div style={{ marginBottom: "2rem" }}>
          <Input
            label="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            required
          />
        </div>
      )}

      <Button onClick={handleContinue} style={{ width: "100%" }}>
        Continue to Payment
      </Button>
    </div>
  );
};

export default CheckoutPage;