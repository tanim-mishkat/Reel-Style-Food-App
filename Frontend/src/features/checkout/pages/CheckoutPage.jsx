import React, { useState } from "react";
import { useCart } from "../../../shared/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import Input from "../../../shared/components/ui/Input/Input";
import Button from "../../../shared/components/ui/Button/Button";
import styles from "./CheckoutPage.module.css";

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
      <div className={styles.emptyState}>
        <div className={styles.emptyEmoji}>🛒</div>
        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
        <p className={styles.emptyText}>
          Discover amazing food videos and start ordering!
        </p>
        <button className={styles.browseBtn} onClick={() => navigate("/")}>
          Start Browsing
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Checkout</h1>
      </div>

      <div className={styles.card}>
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className={styles.orderRow}>
            <span>
              {item.name} x {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className={styles.totalRow}>
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Delivery Options</h3>
        <div className={styles.deliveryOptions}>
          <label className={styles.inputLabel}>
            <input
              type="radio"
              value="delivery"
              checked={deliveryType === "delivery"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Delivery
          </label>
          <label className={styles.inputLabel}>
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
        <div className={styles.section}>
          <Input
            label="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            required
          />
        </div>
      )}

      <div className={styles.continueBtnWrapper}>
        <Button onClick={handleContinue} className={styles.fullWidthBtn}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
