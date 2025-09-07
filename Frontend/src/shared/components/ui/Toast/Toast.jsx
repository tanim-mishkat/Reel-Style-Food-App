import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleShowToast = (event) => {
      setMessage(event.detail);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
};

export default Toast;