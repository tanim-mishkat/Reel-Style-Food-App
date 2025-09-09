import React from "react";
import useCart from "../../../shared/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../../shared/services/api";
import Button from "../../../shared/components/ui/Button/Button";
import styles from "./PaymentPage.module.css";

const PaymentPage = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const handleSuccess = async () => {
    try {
      const orderData = {
        restaurantId: items[0]?.partnerId,
        items: items.map((item) => ({
          foodId: item.id,
          name: item.name,
          qty: item.qty,
          unitPrice: item.price,
        })),
        fulfillment: {
          type: "delivery",
          address: "Sample address",
        },
      };

      const response = await orderService.createOrder(orderData);
      const orderId = response.data.order._id;
      clear();

      // Trigger toast notification
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: "🍽️ Order placed successfully!",
        })
      );

      alert("Payment successful! Order placed.");
      navigate(`/orders/${orderId}`);
    } catch {
      alert("Failed to create order");
    }
  };

  const handleFail = () => {
    alert("Payment failed! Please try again.");
    navigate("/checkout");
  };

  return (
    <div className={styles.paymentWrapper}>
      <h1>Payment</h1>

      <div className={styles.paymentCard}>
        <h3>Total Amount</h3>
        <div className={styles.totalAmount}>${subtotal.toFixed(2)}</div>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleSuccess}
          className={`${styles.successBtn} ${styles.fullWidthBtn}`}
        >
          Simulate Success
        </Button>

        <Button
          onClick={handleFail}
          className={`${styles.failBtn} ${styles.fullWidthBtn}`}
        >
          Simulate Fail
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
