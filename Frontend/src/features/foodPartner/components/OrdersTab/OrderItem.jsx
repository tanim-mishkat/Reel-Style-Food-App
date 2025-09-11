import { useState } from "react";
import { ORDER_STATUSES } from "../../constants/dashboard";
import styles from "./OrderItem.module.css";

// UI mapping for colors is handled in CSS (see module) using status class names.
const NEXT_STATUS = {
  [ORDER_STATUSES.PLACED]: ORDER_STATUSES.ACCEPTED,
  [ORDER_STATUSES.ACCEPTED]: ORDER_STATUSES.PREPARING,
  [ORDER_STATUSES.PREPARING]: ORDER_STATUSES.READY,
  [ORDER_STATUSES.READY]: ORDER_STATUSES.COMPLETED,
};

const OrderItem = ({ order, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(order._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateTotal = () => {
    return (
      order.items?.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) || 0
    );
  };

  const nextStatus = NEXT_STATUS[order.status];
  const canAdvance = nextStatus && !updating;

  return (
    <div className={styles.orderItem}>
      <div className={styles.orderHeader}>
        <div className={styles.orderInfo}>
          <h4 className={styles.orderId}>Order #{order._id?.slice(-6)}</h4>
          <span className={styles.orderDate}>
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div
          className={`${styles.statusBadge} ${
            styles[`status_${order.status}`]
          }`}
        >
          {order.status}
        </div>
      </div>

      <div className={styles.orderDetails}>
        <div className={styles.items}>
          {order.items?.map((item, index) => (
            <div key={index} className={styles.item}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemQuantity}>x{item.quantity}</span>
              <span className={styles.itemPrice}>${item.price}</span>
            </div>
          ))}
        </div>

        <div className={styles.orderTotal}>
          <strong>Total: ${calculateTotal().toFixed(2)}</strong>
        </div>
      </div>

      {canAdvance && (
        <div className={styles.actions}>
          <button
            onClick={() => handleStatusUpdate(nextStatus)}
            disabled={updating}
            className={styles.advanceBtn}
          >
            {updating ? "Updating..." : `Mark as ${nextStatus}`}
          </button>

          {order.status === ORDER_STATUSES.PLACED && (
            <button
              onClick={() => handleStatusUpdate(ORDER_STATUSES.CANCELLED)}
              disabled={updating}
              className={styles.cancelBtn}
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
