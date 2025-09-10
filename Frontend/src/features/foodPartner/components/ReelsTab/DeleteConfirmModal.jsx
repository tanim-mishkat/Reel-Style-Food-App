import { useEffect } from "react";
import styles from "./DeleteConfirmModal.module.css";

const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onCancel]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={styles.warningIcon}
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
          </svg>
        </div>

        <h3 className={styles.title}>Delete Reel</h3>
        <p className={styles.message}>
          Are you sure you want to delete this reel? This action cannot be
          undone.
        </p>

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
