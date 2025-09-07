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
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1>Checkout</h1>
      
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