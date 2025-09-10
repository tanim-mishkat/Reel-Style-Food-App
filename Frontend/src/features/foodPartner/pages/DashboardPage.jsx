import { useState } from "react";
import DashboardTabs from "../components/DashboardTabs/DashboardTabs";
import ProfileTab from "../components/ProfileTab/ProfileTab";
import MenuTab from "../components/MenuTab/MenuTab";
import OrdersTab from "../components/OrdersTab/OrdersTab";
import ReelsTab from "../components/ReelsTab/ReelsTab";
import FollowersTab from "../components/FollowersTab/FollowersTab";
import FloatingActionButton from "../components/FloatingActionButton/FloatingActionButton";
import { useDashboard } from "../hooks/useDashboard";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { activeTab, setActiveTab, error, success } = useDashboard();

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "menu":
        return <MenuTab />;
      case "orders":
        return <OrdersTab />;
      case "reels":
        return <ReelsTab />;
      case "followers":
        return <FollowersTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => window.history.back()}
          className={styles.backButton}
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      {error && <div className={styles.errorText}>{error}</div>}
      {success && <div className={styles.successText}>{success}</div>}

      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.content}>{renderTabContent()}</div>

      <FloatingActionButton />
    </div>
  );
};

export default DashboardPage;
