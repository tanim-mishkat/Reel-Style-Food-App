import ReelGridItem from "./ReelGridItem";
import styles from "./ReelsGrid.module.css";

const ReelsGrid = ({ reels }) => {
  if (reels.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect
              x="2"
              y="3"
              width="20"
              height="14"
              rx="2"
              ry="2"
              strokeWidth="2"
            />
            <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
            <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
          </svg>
        </div>
        <h3>No reels yet</h3>
        <p>Create your first food reel to get started</p>
      </div>
    );
  }

  return (
    <div className={styles.reelsGrid}>
      {reels.map((reel) => (
        <ReelGridItem key={reel._id} reel={reel} />
      ))}
    </div>
  );
};

export default ReelsGrid;
