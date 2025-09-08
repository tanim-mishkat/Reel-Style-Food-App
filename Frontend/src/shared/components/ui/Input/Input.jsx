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
  const hasValue =
    value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={styles.formGroup}>
      <div className={styles.floatingLabelWrap}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || " "}
          required={required}
          className={styles.formInput}
        />
        {label && (
          <label
            htmlFor={id}
            className={`${styles.formLabel} ${hasValue ? styles.shrink : ""}`}
          >
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

export default Input;
