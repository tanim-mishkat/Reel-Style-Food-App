import React from "react";
import styles from "./Button.module.css";

const Button = ({ type = "button", children, onClick, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles.btn}
    >
      {children}
    </button>
  );
};

export default Button;