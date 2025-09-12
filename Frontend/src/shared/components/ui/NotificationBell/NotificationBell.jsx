import React, { useState, useEffect, useRef } from "react";
import styles from "./NotificationBell.module.css";
import { notificationService } from "../../../services/api";

const NotificationBell = ({ role }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

  // Load on mount (from server if logged in; otherwise from localStorage)
  useEffect(() => {
    const load = async () => {
      try {
        if (role === "user") {
          const res = await notificationService.getUserNotifications();
          const list = (res.data?.notifications || []).map((n) => ({
            id: n._id,
            message: n.payload?.message || mapToMessage(n),
            time: new Date(n.createdAt).toLocaleTimeString(),
            read: !!n.readAt,
          }));
          setNotifications(list);
          localStorage.setItem("notifications", JSON.stringify(list));
          return;
        }
        if (role === "partner") {
          const res = await notificationService.getPartnerNotifications();
          const list = (res.data?.notifications || []).map((n) => ({
            id: n._id,
            message: n.payload?.message || mapToMessage(n),
            time: new Date(n.createdAt).toLocaleTimeString(),
            read: !!n.readAt,
          }));
          setNotifications(list);
          localStorage.setItem("notifications", JSON.stringify(list));
          return;
        }
      } catch {/* ignore */}
      // fallback to local
      try {
        const stored = JSON.parse(
          localStorage.getItem("notifications") || "[]"
        );
        if (Array.isArray(stored)) setNotifications(stored);
      } catch {/* ignore */}
    };
    load();
  }, [role]);

  // Listen to realtime pushes (from useRealtime) via your existing custom event
  useEffect(() => {
    const handleTriggerBell = (event) => {
      const detail = event.detail;
      const newNotification =
        typeof detail === "string"
          ? {
              id: Date.now(),
              message: detail,
              time: new Date().toLocaleTimeString(),
              read: false,
            }
          : {
              id: detail?.id || Date.now(),
              message: detail?.message || "New notification",
              time: detail?.time || new Date().toLocaleTimeString(),
              read: !!detail?.read,
            };

      setNotifications((prev) => {
        const next = [newNotification, ...prev];
        try {
          localStorage.setItem("notifications", JSON.stringify(next));
        } catch {/* ignore */}
        return next;
      });
    };

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowPanel(false);
      }
    };

    window.addEventListener("triggerBell", handleTriggerBell);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("triggerBell", handleTriggerBell);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = async () => {
    const newState = !showPanel;
    setShowPanel(newState);
    if (newState) {
      // mark all as read (local + server best-effort)
      const next = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(next);
      try {
        localStorage.setItem("notifications", JSON.stringify(next));
      } catch {/* ignore */}

      // best-effort mark read on server
      try {
        await Promise.all(
          notifications
            .filter((n) => !n.read && n.id && typeof n.id === "string")
            .map((n) =>
              role === "user"
                ? notificationService.markUserRead(n.id)
                : role === "partner"
                ? notificationService.markPartnerRead(n.id)
                : Promise.resolve()
            )
        );
      } catch {/* ignore */}
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div
        ref={bellRef}
        className={styles.bellContainer}
        onClick={handleClick}
        aria-label="Notifications"
      >
        <svg
          className={styles.bellIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <div className={styles.redDot}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </div>

      {showPanel && (
        <div ref={panelRef} className={styles.notificationPanel}>
          <div className={styles.panelHeader}>
            <h3>Notifications</h3>
            <button
              onClick={() => {
                setNotifications([]);
                try {
                  localStorage.removeItem("notifications");
                } catch {
                  /*ignore*/
                }
                setShowPanel(false);
              }}
              className={styles.clearBtn}
            >
              Clear All
            </button>
          </div>
          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.notificationItem} ${
                    !n.read ? styles.unread : ""
                  }`}
                >
                  <div className={styles.notificationMessage}>{n.message}</div>
                  <div className={styles.notificationTime}>{n.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBell;

function mapToMessage(n) {
  const type = n.type;
  const p = n.payload || {};
  switch (type) {
    case "order:created":
      return `📋 New order received (#${String(p.orderId || "").slice(-6)})`;
    case "order:statusUpdated":
      return (
        {
          ACCEPTED: "✅ Your order was accepted",
          PREPARING: "👨🍳 Your order is being prepared",
          READY: "🎉 Your order is ready for pickup",
          COMPLETED: "✨ Order completed — please leave a review",
        }[p.status] || `Order status: ${p.status}`
      );
    case "review:created":
      return `⭐ New review: ${p.stars}★ on order #${String(
        p.orderId || ""
      ).slice(-6)}`;
    case "follow:created":
      return `➕ You have a new follower`;
    default:
      return "New notification";
  }
}
