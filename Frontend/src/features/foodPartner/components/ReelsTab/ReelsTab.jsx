import { useState, useEffect, useCallback } from "react";
import { foodPartnerService } from "../../../../shared/services/api";
import ReelsGrid from "./ReelsGrid";
import ReelsFilter from "./ReelsFilter";
import styles from "./ReelsTab.module.css";

const FILTER_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "oldest", label: "Oldest First" },
];

const ReelsTab = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("recent");

  const fetchReels = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await foodPartnerService.getMyReels();
      let foodItems = response.data.reels || [];

      // Apply sorting based on filter
      switch (filter) {
        case "popular":
          foodItems = foodItems.sort(
            (a, b) => (b.likesCount || 0) - (a.likesCount || 0)
          );
          break;
        case "oldest":
          foodItems = foodItems.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "recent":
        default:
          foodItems = foodItems.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
      }

      setReels(foodItems);
    } catch (err) {
      console.error("Failed to load reels:", err);
      setError("Failed to load reels");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  if (loading) {
    return <div className={styles.loading}>Loading reels...</div>;
  }

  return (
    <div className={styles.reelsTab}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Reels</h3>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{reels.length}</span>
            <span className={styles.statLabel}>Total Reels</span>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <ReelsFilter
        options={FILTER_OPTIONS}
        activeFilter={filter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          // Re-sort existing reels instead of re-fetching
          setReels((prev) => {
            const sorted = [...prev];
            switch (newFilter) {
              case "popular":
                return sorted.sort(
                  (a, b) => (b.likesCount || 0) - (a.likesCount || 0)
                );
              case "oldest":
                return sorted.sort(
                  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
              case "recent":
              default:
                return sorted.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
            }
          });
        }}
      />

      <ReelsGrid reels={reels} />
    </div>
  );
};

export default ReelsTab;
