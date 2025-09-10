import { useState } from "react";
import styles from "./MenuListItem.module.css";

const MenuListItem = ({ item, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={styles.menuItem}>
      <div className={styles.itemContent}>
        <div className={styles.itemInfo}>
          <h4 className={styles.itemTitle}>{item.name}</h4>
          <p className={styles.itemDesc}>{item.description}</p>
          <div className={styles.itemMeta}>
            <span className={styles.itemPrice}>${item.price}</span>
            {item.prepTime && (
              <span className={styles.itemTime}>{item.prepTime} min</span>
            )}
          </div>
        </div>

        {item.photoUrl && (
          <div className={styles.itemImage}>
            <img src={item.photoUrl} alt={item.name} />
          </div>
        )}
      </div>

      <div className={styles.itemActions}>
        <button
          onClick={onEdit}
          className={`${styles.actionBtn} ${styles.editBtn}`}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MenuListItem;
