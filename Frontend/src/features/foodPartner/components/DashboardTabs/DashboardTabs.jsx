import { useState } from "react";
import styles from "./DashboardTabs.module.css";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "menu", label: "Menu" },
  { id: "orders", label: "Orders" },
  { id: "reels", label: "Reels" },
  { id: "followers", label: "Followers" },
];

const DashboardTabs = ({ activeTab, onTabChange }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {TABS.slice(0, 3).map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.tabBtn} ${
              activeTab === tab.id ? styles.tabBtnActive : ""
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className={styles.moreDropdown}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={styles.tabBtn}
          >
            •••
          </button>
          {showMoreMenu && (
            <div className={styles.moreMenu}>
              {TABS.slice(3).map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setShowMoreMenu(false);
                  }}
                  className={styles.moreItem}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
