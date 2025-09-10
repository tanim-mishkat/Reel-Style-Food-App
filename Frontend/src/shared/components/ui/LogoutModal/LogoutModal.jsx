import React from 'react';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                strokeWidth="2"
              />
              <polyline points="16,17 21,12 16,7" strokeWidth="2" />
              <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" />
            </svg>
          </div>
          <h3 className={styles.title}>Logout Confirmation</h3>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>
            Are you sure you want to logout? You'll need to sign in again to access your account.
          </p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
