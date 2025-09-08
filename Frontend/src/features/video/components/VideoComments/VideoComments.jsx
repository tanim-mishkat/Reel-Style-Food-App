import React, { useState, useEffect } from "react";
import { foodService, authService } from "../../../../shared/services/api";
import styles from "./VideoComments.module.css";

const VideoComments = ({ videoId, isOpen, onClose, onCommentPosted }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen && videoId) {
      (async () => {
        try {
          const response = await foodService.getComments(videoId);
          setComments(response.data.comments);
        } catch {
          // Handle error silently
        }
      })();
    }
  }, [isOpen, videoId]);

  useEffect(() => {
    // attempt to get current user profile to determine ownership for delete action
    const fetchUser = async () => {
      try {
        const resp = await authService.getUserProfile();
        setCurrentUser(resp.data.user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await foodService.addComment(videoId, newComment);
      setComments((prev) => [response.data.comment, ...prev]);
      setNewComment("");
      if (typeof onCommentPosted === "function") onCommentPosted();
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;
    try {
      await foodService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      if (typeof onCommentPosted === "function") onCommentPosted(-1);
    } catch {
      // handle silently for now
    }
  };

  function timeAgo(createdAt) {
    const now = Date.now();
    const past = new Date(createdAt).getTime();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) {
      return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
    }

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    }

    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
    }

    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  if (!isOpen) return null;

  return (
    <div className={styles.commentsOverlay}>
      <div className={styles.commentsModal}>
        <div className={styles.commentsHeader}>
          <h3>Comments</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentItem}>
              <strong>@{comment.user.fullName}</strong>
              <p>{comment.text}</p>
              <small>{timeAgo(comment.createdAt)}</small>
              {currentUser &&
                comment.user &&
                (comment.user._id === currentUser._id ||
                  comment.user._id === currentUser.id) && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoComments;
