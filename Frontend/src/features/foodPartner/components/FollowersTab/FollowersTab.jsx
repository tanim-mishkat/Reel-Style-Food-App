import { useState, useEffect } from "react";
import { followService } from "../../../../shared/services/api";
import FollowersList from "./FollowersList";
import styles from "./FollowersTab.module.css";

const FollowersTab = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const response = await followService.getPartnerFollowers();
      setFollowers(response.data.followers || []);
    } catch (err) {
      setError("Failed to load followers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading followers...</div>;
  }

  return (
    <div className={styles.followersTab}>
      <div className={styles.header}>
        <h3 className={styles.title}>Followers</h3>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{followers.length}</span>
            <span className={styles.statLabel}>Total Followers</span>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <FollowersList followers={followers} />
    </div>
  );
};

export default FollowersTab;
