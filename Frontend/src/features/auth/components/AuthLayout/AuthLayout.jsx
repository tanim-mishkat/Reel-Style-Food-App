import React from "react";
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>{title}</h1>
          {subtitle && <p className={styles.authSubtitle}>{subtitle}</p>}
        </div>

        {children}

        {footer && <div className={styles.authFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default AuthLayout;