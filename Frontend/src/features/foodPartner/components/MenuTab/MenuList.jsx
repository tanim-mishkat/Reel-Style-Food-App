import MenuListItem from "./MenuListItem";
import styles from "./MenuList.module.css";

const MenuList = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🍽️</div>
        <h3>No menu items yet</h3>
        <p>Add your first menu item to get started</p>
      </div>
    );
  }

  return (
    <div className={styles.menuList}>
      {items.map((item) => (
        <MenuListItem
          key={item._id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item._id)}
        />
      ))}
    </div>
  );
};

export default MenuList;
