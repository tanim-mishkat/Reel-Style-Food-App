import React, { useState, useEffect } from "react";
import styles from "./VideoActions.module.css";

const VideoActions = ({
  videoId,
  isLiked,
  isSaved,
  likesCount,
  savesCount,
  commentsCount,
  onLike,
  onSave,
  onComment,
}) => {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);
  const [localLikes, setLocalLikes] = useState(likesCount ?? 0);
  const [localSaves, setLocalSaves] = useState(savesCount ?? 0);

  useEffect(() => setLocalIsLiked(isLiked), [isLiked]);
  useEffect(() => setLocalIsSaved(isSaved), [isSaved]);
  useEffect(() => setLocalLikes(likesCount ?? 0), [likesCount]);
  useEffect(() => setLocalSaves(savesCount ?? 0), [savesCount]);

  const handleLike = () => {
    // optimistic UI update
    setLocalIsLiked((prev) => {
      const next = !prev;
      setLocalLikes((l) => Math.max(0, l + (next ? 1 : -1)));
      return next;
    });
    if (typeof onLike === "function") onLike(videoId);
  };

  const handleSave = () => {
    // optimistic UI update
    setLocalIsSaved((prev) => {
      const next = !prev;
      setLocalSaves((s) => Math.max(0, s + (next ? 1 : -1)));
      return next;
    });
    if (typeof onSave === "function") onSave(videoId);
  };

  return (
    <div className={styles.sideActions}>
      <button
        className={`${styles.actionBtn} ${styles.likeBtn} ${
          localIsLiked ? styles.liked : ""
        }`}
        onClick={handleLike}
      >
        <svg
          className={styles.actionIcon}
          viewBox="0 0 24 24"
          fill={localIsLiked ? "var(--like-color)" : "currentColor"}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className={styles.actionCount}>{localLikes}</span>
      </button>

      <button
        className={`${styles.actionBtn} ${styles.saveBtn} ${
          localIsSaved ? styles.saved : ""
        }`}
        onClick={handleSave}
      >
        <svg
          className={styles.actionIcon}
          viewBox="0 0 24 24"
          fill={localIsSaved ? "var(--save-color)" : "currentColor"}
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2zm-7 13.97l-4.21 1.81.39-4.65L4.52 11l4.75-.39L12 6.1l2.73 4.51L19.48 11l-3.66 3.13.39 4.65L12 16.97z" />
        </svg>
        <span className={styles.actionCount}>{localSaves}</span>
      </button>

      <button
        className={`${styles.actionBtn} ${styles.commentBtn}`}
        onClick={() => onComment(videoId)}
      >
        <svg
          className={styles.actionIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
        <span className={styles.actionCount}>{commentsCount ?? 0}</span>
      </button>
    </div>
  );
};

export default VideoActions;
