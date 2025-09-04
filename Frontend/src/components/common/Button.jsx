import React from "react";

const Button = ({ type = "button", children, onClick, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn btn-primary"
    >
      {children}
    </button>
  );
};

export default Button;
