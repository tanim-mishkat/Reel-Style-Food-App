import React from "react";
import styles from "./Input.module.css";

const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={id} className={styles.formLabel}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={styles.formInput}
      />
    </div>
  );
};

export default Input;