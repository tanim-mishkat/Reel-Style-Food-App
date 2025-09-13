import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { foodPartnerService, foodService } from "../../../shared/services/api";
import DeleteConfirmModal from "../components/ReelsTab/DeleteConfirmModal";
import EditReelModal from "../components/ReelsTab/EditReelModal";
import styles from "./PartnerReelsPage.module.css";

const PartnerReelsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, reelId: null });
  const [editModal, setEditModal] = useState({ show: false, reel: null });
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  const fetchPartnerReels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await foodPartnerService.getMyReels();
      setReels(response.data.reels || []);
    } catch (err) {
      console.error("Failed to load partner reels:", err);
      setError("Failed to load reels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartnerReels();
  }, [fetchPartnerReels]);

  useEffect(() => {
    if (reels.length > 0 && id) {
      const index = reels.findIndex((reel) => reel._id === id);
      if (index !== -1) {
        setCurrentIndex(index);
        setTimeout(() => {
          const el = containerRef.current;
          if (el) {
            el.scrollTo({
              top: index * window.innerHeight,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
  }, [reels, id]);

  // Close menu on outside/scroll/Escape
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    const handleScrollClose = () => setShowMenu(false);
    const handleKeyDown = (e) => e.key === "Escape" && setShowMenu(false);

    const containerEl = containerRef.current;
    const t = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      containerEl && containerEl.addEventListener("scroll", handleScrollClose);
    }, 100);

    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      containerEl &&
        containerEl.removeEventListener("scroll", handleScrollClose);
    };
  }, [showMenu]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const newIndex = Math.round(el.scrollTop / window.innerHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex);
      const newReelId = reels[newIndex]._id;
      window.history.replaceState(null, "", `/partner/reels/${newReelId}`);
    }
  };

  const handleClose = () => navigate("/partner/dashboard?tab=reels");
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowMenu((s) => !s);
  };
  const handleEdit = () => {
    const currentReel = reels[currentIndex];
    setEditModal({ show: true, reel: currentReel });
    setShowMenu(false);
  };
  const handleDelete = () => {
    const currentReel = reels[currentIndex];
    setDeleteModal({ show: true, reelId: currentReel._id });
    setShowMenu(false);
  };

  const confirmDelete = async () => {
    try {
      await foodService.deleteFood(deleteModal.reelId);
      const updated = reels.filter((r) => r._id !== deleteModal.reelId);
      setReels(updated);
      setDeleteModal({ show: false, reelId: null });
      if (updated.length === 0) navigate("/partner/dashboard?tab=reels");
      else if (currentIndex >= updated.length)
        setCurrentIndex(updated.length - 1);
    } catch (err) {
      console.error("Failed to delete reel:", err);
    }
  };

  const handleUpdateReel = async (updatedData) => {
    try {
      const { data } = await foodService.updateFood(
        editModal.reel._id,
        updatedData
      );
      setReels((prev) =>
        prev.map((r) =>
          r._id === editModal.reel._id ? { ...r, ...data.food } : r
        )
      );
      setEditModal({ show: false, reel: null });
    } catch (err) {
      console.error("Failed to update reel:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading reels...</p>
      </div>
    );
  }

  if (error || reels.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>No Reels Found</h2>
        <p>{error || "You haven't created any video reels yet."}</p>
        <button onClick={handleClose} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.reelsContainer}>
      <div className={styles.header}>
        <button onClick={handleClose} className={styles.closeButton}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>
        <h1 className={styles.title}>My Reels</h1>
        <div className={styles.counter}>
          {currentIndex + 1} / {reels.length}
        </div>
      </div>

      <div
        ref={containerRef}
        className={styles.videosContainer}
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
          <div key={reel._id} className={styles.videoWrapper}>
            <video
              src={reel.videoUrl || reel.video}
              className={styles.video}
              loop
              muted
              playsInline
              preload="metadata"
              autoPlay={index === currentIndex}
            />

            <div className={styles.videoInfo}>
              <div className={styles.videoDetails}>
                <h3 className={styles.videoTitle}>{reel.name}</h3>
                {reel.description && (
                  <p className={styles.videoDescription}>{reel.description}</p>
                )}
                <div className={styles.videoMeta}>
                  {reel.price && (
                    <span className={styles.price}>${reel.price}</span>
                  )}
                  {reel.prepTime && (
                    <span className={styles.prepTime}>{reel.prepTime} min</span>
                  )}
                </div>
              </div>

              <div className={styles.videoStats}>
                <div className={styles.stat}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>{reel.likesCount || 0}</span>
                </div>
                <div className={styles.stat}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{reel.commentsCount || 0}</span>
                </div>
                <div className={styles.stat}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" />
                  </svg>
                  <span>{reel.savesCount || 0}</span>
                </div>

                {index === currentIndex && (
                  <div className={styles.statsMenuContainer} ref={menuRef}>
                    <button
                      onClick={handleMenuToggle}
                      className={`${styles.statsMenuButton} ${
                        showMenu ? styles.active : ""
                      }`}
                      aria-label="More options"
                      aria-expanded={showMenu}
                      aria-haspopup="menu"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                    {showMenu && (
                      <div className={styles.statsDropdownMenu}>
                        <button
                          onClick={handleEdit}
                          className={styles.statsMenuItem}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              strokeWidth="2"
                            />
                            <path
                              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              strokeWidth="2"
                            />
                          </svg>
                          Edit Post
                        </button>
                        <button
                          onClick={handleDelete}
                          className={styles.statsMenuItem}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <polyline points="3,6 5,6 21,6" strokeWidth="2" />
                            <path
                              d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"
                              strokeWidth="2"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteModal.show && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ show: false, reelId: null })}
        />
      )}

      {editModal.show && (
        <EditReelModal
          reel={editModal.reel}
          onSave={handleUpdateReel}
          onCancel={() => setEditModal({ show: false, reel: null })}
        />
      )}
    </div>
  );
};

export default PartnerReelsPage;
