import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      addToast(event.detail);
      // Also trigger bell notification with message
      window.dispatchEvent(new CustomEvent('triggerBell', { detail: event.detail }));
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <div key={toast.id} className={styles.toast} onClick={() => removeToast(toast.id)}>
          <span className={styles.toastIcon}>🔔</span>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;