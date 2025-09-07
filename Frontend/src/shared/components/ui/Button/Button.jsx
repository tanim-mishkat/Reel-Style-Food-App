import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  style,
  ...props 
}) => {
  const className = `${styles.button} ${styles[variant]} ${styles[size]} ${disabled ? styles.disabled : ''}`;
  
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;