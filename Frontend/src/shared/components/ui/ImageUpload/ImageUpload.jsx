import React, { useState, useRef } from "react";
import styles from "./ImageUpload.module.css";

const ImageUpload = ({
  id,
  label,
  value,
  onChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  required = false,
}) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return "Please select an image file";
    }
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(
        maxSize / (1024 * 1024)
      )}MB`;
    }
    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    if (onChange) {
      onChange(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {label && (
        <label className={styles.uploadLabel}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.uploadArea} ${
          dragActive ? styles.dragActive : ""
        } ${preview ? styles.hasPreview : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className={styles.hiddenInput}
          required={required}
        />

        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <div className={styles.previewOverlay}>
              <button
                type="button"
                onClick={handleRemove}
                className={styles.removeButton}
              >
                <svg viewBox="0 0 24 24" className={styles.removeIcon}>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
              <p className={styles.changeText}>Click to change</p>
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <div className={styles.uploadIcon}>
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div className={styles.uploadText}>
              <p className={styles.primaryText}>
                <span className={styles.clickText}>Click to upload</span> or
                drag and drop
              </p>
              <p className={styles.secondaryText}>
                PNG, JPG, GIF up to {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default ImageUpload;
