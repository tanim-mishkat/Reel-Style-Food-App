import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { foodService } from "../../../shared/services/api";
import { ROUTES } from "../../../routes/routeConfig";
import BottomNav from "../../../shared/components/layout/BottomNav/BottomNav";
import styles from "./SavedPage.module.css";

const SavedPage = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const response = await foodService.getSavedFoodItems();
        setSavedVideos(response.data.savedFoodItems);
      } catch (err) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedVideos();
  }, []);

  if (loading) {
    return (
      <div className={styles.savedContainer}>
        <div className={styles.savedHeader}>
          <h1>Saved Videos</h1>
        </div>
        <div className={styles.savedContent}>
          <div className={styles.emptyState}>
            <p>Loading...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.savedContainer}>
      <div className={styles.savedHeader}>
        <h1>Saved Videos</h1>
      </div>

      <div className={styles.savedContent}>
        {savedVideos.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <h2>No saved videos yet</h2>
            <p>Videos you save will appear here</p>
          </div>
        ) : (
          <div className={styles.savedGrid}>
            {savedVideos.map((video) => (
              <div 
                key={video._id} 
                className={styles.savedVideoItem}
                onClick={() => navigate(ROUTES.USER_SAVED_VIDEOS)}
              >
                <video
                  src={video.video}
                  className={styles.savedVideo}
                  muted
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
                <div className={styles.savedVideoInfo}>
                  <h3>{video.name}</h3>
                  <p>{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SavedPage;