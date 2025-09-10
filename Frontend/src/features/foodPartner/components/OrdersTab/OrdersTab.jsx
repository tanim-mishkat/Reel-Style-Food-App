import { useState, useEffect } from "react";
import { orderService } from "../../../../shared/services/api";
import OrderList from "./OrderList";
import OrderStatusFilter from "./OrderStatusFilter";
import { ORDER_STATUSES } from "../../constants/dashboard";
import styles from "./OrdersTab.module.css";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getPartnerOrders(statusFilter);
      setOrders(response.data.orders || []);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  return (
    <div className={styles.ordersTab}>
      <div className={styles.header}>
        <h3 className={styles.title}>Order Management</h3>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{orders.length}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <OrderStatusFilter
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <OrderList orders={orders} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default OrdersTab;
