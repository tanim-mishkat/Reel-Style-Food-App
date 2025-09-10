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
        // Filter out null/undefined items and ensure they have required properties
        const validVideos = (response.data.savedFoodItems || [])
          .filter((video) => video && video._id && video.video)
          .map((video) => ({
            ...video,
            name: video.name || "Untitled",
            description: video.description || "No description",
          }));
        setSavedVideos(validVideos);
      } catch (err) {
        console.error("Error fetching saved videos:", err);
        setSavedVideos([]);
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
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <h2>No saved videos yet</h2>
            <p>Videos you save will appear here</p>
          </div>
        ) : (
          <div className={styles.savedGrid}>
            {savedVideos.map((video) => {
              // Additional safety check
              if (!video || !video._id || !video.video) {
                return null;
              }

              return (
                <div
                  key={video._id}
                  className={styles.savedVideoItem}
                  onClick={() =>
                    navigate(ROUTES.USER_SAVED_VIDEOS, {
                      state: { startVideoId: video._id },
                    })
                  }
                >
                  <video
                    src={video.video}
                    className={styles.savedVideo}
                    muted
                    preload="metadata"
                    onError={(e) => {
                      console.error("Error loading video:", video.video);
                      e.target.style.display = "none";
                    }}
                  />
                  <div className={styles.savedVideoInfo}>
                    <h3>{video.name || "Untitled"}</h3>
                    <p>{video.description || "No description"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SavedPage;
