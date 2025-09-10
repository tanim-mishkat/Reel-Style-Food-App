import { useState, useEffect } from "react";
import Input from "../../../../shared/components/ui/Input/Input";
import Button from "../../../../shared/components/ui/Button/Button";
import styles from "./MenuForm.module.css";

const MenuForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    prepTime: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        prepTime: item.prepTime || "",
        photoUrl: item.photoUrl || "",
      });
    }
  }, [item]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h3>{item ? "Edit Menu Item" : "Add Menu Item"}</h3>
          <button onClick={onCancel} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <Input
              label="Item Name"
              value={formData.name}
              onChange={handleChange("name")}
              required
            />
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange("price")}
              required
            />
            <Input
              label="Prep Time (minutes)"
              type="number"
              value={formData.prepTime}
              onChange={handleChange("prepTime")}
            />
            <Input
              label="Photo URL"
              type="url"
              value={formData.photoUrl}
              onChange={handleChange("photoUrl")}
            />
          </div>

          <div className={styles.textareaGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={handleChange("description")}
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : item ? "Update" : "Add Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuForm;
