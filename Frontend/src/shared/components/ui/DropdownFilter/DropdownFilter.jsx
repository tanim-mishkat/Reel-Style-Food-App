import { useDropdown } from "../../../hooks/useDropdown";
import styles from "./DropdownFilter.module.css";

const DropdownFilter = ({
  options,
  activeValue,
  onValueChange,
  placeholder = "Select option",
  className = "",
}) => {
  const { isOpen, dropdownRef, toggle, close } = useDropdown();

  const activeOption = options.find(
    (option) => option.value === activeValue
  ) || { label: placeholder };

  const handleOptionClick = (value) => {
    onValueChange(value);
    close();
  };

  return (
    <div className={`${styles.filterContainer} ${className}`} ref={dropdownRef}>
      <button
        onClick={toggle}
        className={styles.filterButton}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={styles.filterIcon}
        >
          <polygon
            points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"
            strokeWidth="2"
          />
        </svg>
        <span>{activeOption.label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
        >
          <polyline points="6,9 12,15 18,9" strokeWidth="2" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`${styles.dropdownItem} ${
                activeValue === option.value ? styles.active : ""
              }`}
              role="option"
              aria-selected={activeValue === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
