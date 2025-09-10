import OrderItem from "./OrderItem";
import styles from "./OrderList.module.css";

const OrderList = ({ orders, onStatusUpdate }) => {
  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M9 12l2 2 4-4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3>No orders found</h3>
        <p>Orders will appear here when customers place them</p>
      </div>
    );
  }

  return (
    <div className={styles.orderList}>
      {orders.map((order) => (
        <OrderItem
          key={order._id}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default OrderList;
