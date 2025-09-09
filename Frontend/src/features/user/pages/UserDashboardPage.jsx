import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  orderService,
  authService,
  followService,
} from "../../../shared/services/api";
import BottomNav from "../../../shared/components/layout/BottomNav/BottomNav";
import Input from "../../../shared/components/ui/Input/Input";
import Button from "../../../shared/components/ui/Button/Button";
import Loading from "../../../shared/components/ui/Loading/Loading";
import pageStyles from "../../../shared/components/ui/Page/Page.module.css";
import styles from "./UserDashboardPage.module.css";

const UserDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [followedPartners, setFollowedPartners] = useState([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, userResponse] = await Promise.all([
          orderService.getUserOrders(),
          authService.getUserProfile(),
        ]);

        const newOrders = ordersResponse.data.orders || [];

        // Check for status changes in ongoing orders
        if (orders.length > 0) {
          const ongoingOrders = orders.filter(
            (order) => !["COMPLETED", "CANCELLED"].includes(order.status)
          );
          ongoingOrders.forEach((oldOrder) => {
            const newOrder = newOrders.find((o) => o._id === oldOrder._id);
            if (newOrder && newOrder.status !== oldOrder.status) {
              const statusMessages = {
                ACCEPTED: "✅ Your order has been accepted!",
                PREPARING: "👨🍳 Your order is being prepared!",
                READY: "🎉 Your order is ready for pickup!",
                COMPLETED: "✨ Order completed! Please rate your experience.",
              };

              const message =
                statusMessages[newOrder.status] ||
                `Order status: ${newOrder.status}`;

              // Trigger toast and bell notifications
              window.dispatchEvent(
                new CustomEvent("showToast", { detail: message })
              );
              window.dispatchEvent(
                new CustomEvent("triggerBell", { detail: message })
              );
            }
          });
        }

        setOrders(newOrders);
        setUser(userResponse.data.user);
        setFullName(userResponse.data.user.fullName);

        // Fetch followed partners
        try {
          const followResponse = await followService.getFollowedPartners();
          setFollowedPartners(followResponse.data.partners);
        } catch (error) {
          // Handle silently
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setOrders([]);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Poll for order updates every 10 seconds if user has ongoing orders
    const interval = setInterval(() => {
      const ongoingOrders = orders.filter(
        (order) => !["COMPLETED", "CANCELLED"].includes(order.status)
      );
      if (ongoingOrders.length > 0) {
        fetchData();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orders]);

  const handleUpdateProfile = async () => {
    try {
      const response = await authService.updateUserProfile({ fullName });
      setUser(response.data.user);
      setEditMode(false);
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: "Profile updated successfully!",
        })
      );
    } catch (error) {
      console.error("Failed to update profile");
    }
  };

  const ongoingOrders = orders.filter(
    (order) => !["COMPLETED", "CANCELLED"].includes(order.status)
  );
  const completedOrders = orders.filter((order) =>
    ["COMPLETED", "CANCELLED"].includes(order.status)
  );
  const totalSpent = orders.reduce(
    (sum, order) =>
      sum +
      (order.items?.reduce(
        (itemSum, item) => itemSum + item.unitPrice * item.qty,
        0
      ) || 0),
    0
  );

  if (loading) return <Loading />;

  if (!user)
    return (
      <div className={pageStyles.pageContainer}>
        <div className={styles.centerMessage}>
          Please log in to view dashboard
        </div>
      </div>
    );

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.pageHeader}>
        <h1>Dashboard</h1>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className={`${pageStyles.card} ${styles.cardMargin}`}>
          <div className={styles.rowBetween}>
            <h2 className={styles.h2Small}>Profile</h2>
            <Button onClick={() => setEditMode(!editMode)} className="">
              {editMode ? "Cancel" : "Edit"}
            </Button>
          </div>

          {editMode ? (
            <div className={styles.formColumn}>
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </div>
          ) : (
            <div>
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button
                onClick={() => setShowFollowing(true)}
                className={pageStyles.btnInline}
              >
                View Following
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className={pageStyles.gridStats}>
        <div className={`${pageStyles.card} ${pageStyles.statCenter}`}>
          <div className={`${pageStyles.statNumber} ${styles.statPrimary}`}>
            {orders.length}
          </div>
          <div className={pageStyles.statLabel}>Orders</div>
        </div>
        <div className={`${pageStyles.card} ${pageStyles.statCenter}`}>
          <div className={`${pageStyles.statNumber} ${styles.statAmber}`}>
            {ongoingOrders.length}
          </div>
          <div className={pageStyles.statLabel}>Active</div>
        </div>
        <div className={`${pageStyles.card} ${pageStyles.statCenter}`}>
          <div className={`${pageStyles.statNumber} ${styles.statGreen}`}>
            ${totalSpent.toFixed(2)}
          </div>
          <div className={pageStyles.statLabel}>Spent</div>
        </div>
        <div className={`${pageStyles.card} ${pageStyles.statCenter}`}>
          <div className={`${pageStyles.statNumber} ${styles.statBlue}`}>
            {followedPartners.length}
          </div>
          <div className={pageStyles.statLabel}>Following</div>
        </div>
      </div>

      {/* Ongoing Orders */}
      {ongoingOrders.length > 0 && (
        <div className={styles.sectionPadding}>
          <h2 className={styles.sectionTitle}>Ongoing Orders</h2>
          {ongoingOrders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className={`${pageStyles.cardNoBorder} ${styles.clickableCard}`}
            >
              <div className={styles.rowBetween}>
                <div>
                  <h3 className={styles.h3NoMargin}>
                    Order #{order._id.slice(-6)}
                  </h3>
                  <div
                    className={`${styles.statusBadge} ${
                      order.status === "PLACED"
                        ? styles.statusPlaced
                        : order.status === "PREPARING"
                        ? styles.statusPreparing
                        : styles.statusOther
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
                <div className={styles.alignRight}>
                  <div className={styles.priceBold}>
                    $
                    {order.items
                      ?.reduce(
                        (sum, item) => sum + item.unitPrice * item.qty,
                        0
                      )
                      .toFixed(2)}
                  </div>
                  <div className={styles.mutedSmall}>
                    {order.items?.length} items
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className={styles.sectionPadding}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        {completedOrders.slice(0, 5).map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            className={`${pageStyles.card} ${pageStyles.cardHoverLift} ${styles.recentClickable}`}
          >
            <div className={styles.rowBetween}>
              <div>
                <h4 className={styles.h4NoMargin}>
                  Order #{order._id.slice(-6)}
                </h4>
                <div className={styles.mutedSmall}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className={styles.alignRight}>
                <div className={styles.priceBold}>
                  $
                  {order.items
                    ?.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
                    .toFixed(2)}
                </div>
                <div
                  className={
                    order.status === "COMPLETED"
                      ? styles.statusCompletedColor
                      : styles.statusOtherColor
                  }
                >
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length > 5 && (
          <button
            onClick={() => navigate("/orders")}
            className={`${pageStyles.card} ${pageStyles.cardClickable} ${pageStyles.cardHoverLift}`}
          >
            View All Orders
          </button>
        )}
      </div>

      {/* Following Modal */}
      {showFollowing && (
        <div className={pageStyles.modalBackdrop}>
          <div className={pageStyles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Following ({followedPartners.length})</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className={pageStyles.btnInlineNoBg}
              >
                ×
              </button>
            </div>
            {followedPartners.length === 0 ? (
              <div className={styles.followingEmptyText}>
                <div className={styles.followingIcon}>👥</div>
                <p className={styles.h3NoMargin}>
                  Not following any restaurants yet
                </p>
              </div>
            ) : (
              followedPartners.map((follow) => (
                <div key={follow._id} className={pageStyles.listItem}>
                  <span>{follow.partner.fullName}</span>
                  <button
                    onClick={() =>
                      navigate(`/food-partner/${follow.partner._id}`)
                    }
                    className={`${pageStyles.btnInline} ${styles.viewBtnSmall}`}
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default UserDashboardPage;
