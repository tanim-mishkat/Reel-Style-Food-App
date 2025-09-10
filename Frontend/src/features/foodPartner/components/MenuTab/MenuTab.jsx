import { useState, useEffect } from "react";
import { menuService } from "../../../../shared/services/api";
import MenuList from "./MenuList";
import MenuForm from "./MenuForm";
import styles from "./MenuTab.module.css";

const MenuTab = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuService.getMyMenuItems();
      setMenuItems(response.data.menuItems || []);
    } catch (err) {
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      await menuService.deleteMenuItem(itemId);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      setError("Failed to delete menu item");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        const response = await menuService.updateMenuItem(
          editingItem._id,
          formData
        );
        setMenuItems((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? response.data.menuItem : item
          )
        );
      } else {
        const response = await menuService.createMenuItem(formData);
        setMenuItems((prev) => [...prev, response.data.menuItem]);
      }
      setShowAddForm(false);
      setEditingItem(null);
    } catch (err) {
      setError(err.message || "Failed to save menu item");
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading menu items...</div>;
  }

  return (
    <div className={styles.menuTab}>
      <div className={styles.header}>
        <h3 className={styles.title}>Menu Management</h3>
        <button onClick={handleAddItem} className={styles.addButton}>
          Add Item
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showAddForm && (
        <MenuForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <MenuList
        items={menuItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};

export default MenuTab;
