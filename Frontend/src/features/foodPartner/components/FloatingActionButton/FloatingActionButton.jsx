import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../routes/routeConfig";
import styles from "./FloatingActionButton.module.css";

const FloatingActionButton = ({
  icon = "plus",
  onClick,
  route = ROUTES.CREATE_FOOD,
  ariaLabel = "Create new content",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  const renderIcon = () => {
    switch (icon) {
      case "plus":
        return (
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <button
      className={styles.floatingBtn}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {renderIcon()}
    </button>
  );
};

export default FloatingActionButton;
