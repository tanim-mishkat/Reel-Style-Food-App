import styles from "./FollowerItem.module.css";

const FollowerItem = ({ follower }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={styles.followerItem}>
      <div className={styles.avatar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
          <circle cx="12" cy="7" r="4" strokeWidth="2" />
        </svg>
      </div>

      <div className={styles.followerInfo}>
        <h4 className={styles.followerName}>
          {follower.user?.fullName || "Unknown User"}
        </h4>
        <p className={styles.followDate}>
          Followed on {formatDate(follower.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default FollowerItem;
