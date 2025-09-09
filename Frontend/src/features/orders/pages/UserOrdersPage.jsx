import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../../shared/services/api";
import BottomNav from "../../../shared/components/layout/BottomNav/BottomNav";
import Loading from "../../../shared/components/ui/Loading/Loading";
import pageStyles from "../../../shared/components/ui/Page/Page.module.css";
import styles from "./Orders.module.css";
import utils from "../../../shared/components/ui/Utils.module.css";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getUserOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.pageHeader}>
        <h1>My Orders</h1>
      </div>

      <div className={styles.containerPadding}>
        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3 className={styles.emptyTitle}>No orders yet</h3>
            <p className={styles.smallNote}>
              Your order history will appear here
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className={`${pageStyles.cardNoBorder} ${pageStyles.cardClickable} ${styles.cardSpacing}`}
            >
              <div className={utils.flexBetween}>
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p className={styles.muted}>
                    Status:{" "}
                    <span
                      className={`${styles.statusBold} ${
                        order.status === "COMPLETED"
                          ? styles.statusCompleted
                          : styles.statusOther
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className={styles.mutedSmall}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.rightAligned}>
                  <p className={styles.statusBold}>
                    $
                    {order.items
                      ?.reduce(
                        (sum, item) => sum + item.unitPrice * item.qty,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <p className={styles.smallNote}>
                    {order.items?.length} items
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default UserOrdersPage;
