import React, { useState, useEffect, useRef } from 'react';
import styles from './NotificationBell.module.css';

const NotificationBell = () => {
  const [hasNotification, setHasNotification] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleTriggerBell = (event) => {
      const message = event.detail || 'New notification';
      const newNotification = {
        id: Date.now(),
        message,
        time: new Date().toLocaleTimeString(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      setHasNotification(true);
    };

    // Click outside to close panel
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          bellRef.current && !bellRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    window.addEventListener('triggerBell', handleTriggerBell);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('triggerBell', handleTriggerBell);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setShowPanel(!showPanel);
    if (!showPanel) {
      // Mark all as read when opening panel
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setHasNotification(false);
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setShowPanel(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div ref={bellRef} className={styles.bellContainer} onClick={handleClick}>
        <svg className={styles.bellIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {unreadCount > 0 && (
          <div className={styles.redDot}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {showPanel && (
        <div ref={panelRef} className={styles.notificationPanel}>
          <div className={styles.panelHeader}>
            <h3>Notifications</h3>
            <button onClick={clearAll} className={styles.clearBtn}>Clear All</button>
          </div>
          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>No notifications</div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}>
                  <div className={styles.notificationMessage}>{notification.message}</div>
                  <div className={styles.notificationTime}>{notification.time}</div>
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