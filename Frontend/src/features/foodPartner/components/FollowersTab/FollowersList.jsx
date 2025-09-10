import FollowerItem from "./FollowerItem";
import styles from "./FollowersList.module.css";

const FollowersList = ({ followers }) => {
  if (followers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              strokeWidth="2"
            />
            <circle cx="9" cy="7" r="4" strokeWidth="2" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
          </svg>
        </div>
        <h3>No followers yet</h3>
        <p>When users follow your restaurant, they'll appear here</p>
      </div>
    );
  }

  return (
    <div className={styles.followersList}>
      {followers.map((follower) => (
        <FollowerItem key={follower._id} follower={follower} />
      ))}
    </div>
  );
};

export default FollowersList;
