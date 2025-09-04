import React from "react";

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
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
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
        className="form-input"
      />
    </div>
  );
};

export default Input;
