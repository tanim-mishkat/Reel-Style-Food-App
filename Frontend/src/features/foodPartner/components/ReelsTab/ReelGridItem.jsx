import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReelGridItem.module.css";

const ReelGridItem = ({ reel }) => {
  const [showStats, setShowStats] = useState(false);
  const navigate = useNavigate();

  const handleReelClick = () => {
    navigate(`/partner/reels/${reel._id}`);
  };

  const getVideoUrl = () => {
    return reel.videoUrl || reel.video;
  };

  const formatCount = (count) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div
      className={styles.reelItem}
      onMouseEnter={() => setShowStats(true)}
      onMouseLeave={() => setShowStats(false)}
      onClick={handleReelClick}
    >
      <div className={styles.videoContainer}>
        {getVideoUrl() ? (
          <video
            src={getVideoUrl()}
            className={styles.video}
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.target.play().catch(() => {})}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="5,3 19,12 5,21" strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Play icon indicator */}
        <div className={styles.playIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>

        {/* Stats overlay on hover */}
        <div
          className={`${styles.statsOverlay} ${
            showStats ? styles.visible : ""
          }`}
        >
          <div className={styles.stats}>
            <div className={styles.stat}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{formatCount(reel.likesCount)}</span>
            </div>
            <div className={styles.stat}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{formatCount(reel.commentsCount)}</span>
            </div>
            <div className={styles.stat}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" />
              </svg>
              <span>{formatCount(reel.savesCount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.reelInfo}>
        <h4 className={styles.reelTitle}>{reel.name}</h4>
        {reel.price && <p className={styles.reelPrice}>${reel.price}</p>}
      </div>
    </div>
  );
};

export default ReelGridItem;
