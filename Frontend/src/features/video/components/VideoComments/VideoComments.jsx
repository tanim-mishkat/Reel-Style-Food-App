import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { foodService, authService } from "../../../../shared/services/api";
import styles from "./VideoComments.module.css";

const DEFAULT_AVATAR = "/default_image.jpeg";

const VideoComments = ({ videoId, isOpen, onClose, onCommentPosted }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState(""); 
  const [likedComments, setLikedComments] = useState({});
  const [replyError, setReplyError] = useState(null);
  const listRef = useRef(null);
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoId) {
      (async () => {
        try {
          const response = await foodService.getComments(videoId);
          setComments(response?.data?.comments || []);
        } catch (err) {
          console.error("Failed fetching comments", err);
        }
      })();
    }
  }, [isOpen, videoId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await authService.getUserProfile();
        setCurrentUser(resp?.data?.user || null);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  // Reset reply box when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReplyTo(null);
      setReplyText("");
      setReplyError(null);
    }
  }, [isOpen]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await foodService.addComment(videoId, newComment);
      setComments((prev) => [response.data.comment, ...prev]);
      setNewComment("");
      if (typeof onCommentPosted === "function") onCommentPosted();
    } catch (err) {
      console.error("Add comment failed", err);
      if (err && err.status === 422) {
        alert(err.message || "Validation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteOpen = (id) => setConfirmDelete({ open: true, id });
  const confirmDeleteCancel = () => setConfirmDelete({ open: false, id: null });

  const handleDeleteComment = async () => {
    const commentId = confirmDelete.id;
    if (!commentId) return;
    try {
      await foodService.deleteComment(commentId);
      const removeFromTree = (list, id) =>
        list
          .filter((c) => c._id !== id)
          .map((c) => ({ ...c, replies: removeFromTree(c.replies || [], id) }));
      setComments((prev) => removeFromTree(prev, commentId));
      if (typeof onCommentPosted === "function") onCommentPosted(-1);
    } catch {
      // silent
    } finally {
      confirmDeleteCancel();
    }
  };

  const handleReply = (comment) => {
    setReplyError(null);
    setReplyTo(comment);
    const fullName =
      comment?.user?.fullName ??
      comment?.user?.name ??
      comment?.user?.username ??
      "user";
    const mention = `@${fullName} `;
    setReplyText(mention); // prefill with mention
  };

  // Keep focus glued to the reply input (pre-paint, so it doesn't flicker away)
  useLayoutEffect(() => {
    if (replyTo && replyInputRef.current) {
      // layout phase focus to avoid losing focus on re-render
      replyInputRef.current.focus();
      // ensure caret at end (Safari sometimes puts at start)
      const node = replyInputRef.current;
      const val = node.value;
      node.setSelectionRange?.(val.length, val.length);
    }
  }, [replyTo, replyText]);

  const submitReply = async (parentId) => {
    const text = (replyText || "").trim();
    if (!text) return;
    try {
      const response = await foodService.addComment(videoId, text, parentId);
      const addReplyToTree = (list, pid, reply) =>
        list.map((item) => {
          if (item._id === pid) {
            return { ...item, replies: [reply, ...(item.replies || [])] };
          }
          return {
            ...item,
            replies: addReplyToTree(item.replies || [], pid, reply),
          };
        });

      setComments((prev) =>
        addReplyToTree(prev, parentId, response.data.comment)
      );
      setReplyTo(null);
      setReplyText("");
      if (typeof onCommentPosted === "function") onCommentPosted();
    } catch (err) {
      console.error("Submit reply failed", err);
      const msg = err?.message || "Validation failed";
      setReplyError(msg);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const resp = await foodService.likeComment(commentId);
      const delta = resp?.data?.liked ? 1 : -1;
      const updateLikes = (list, id, d) =>
        list.map((c) => {
          if (c._id === id) {
            return { ...c, likesCount: (c.likesCount || 0) + d };
          }
          return { ...c, replies: updateLikes(c.replies || [], id, d) };
        });

      setComments((prev) => updateLikes(prev, commentId, delta));
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !!resp?.data?.liked,
      }));
    } catch (err) {
      console.error("Like failed", err);
      if (err && err.status === 422) alert(err.message || "Could not like");
    }
  };

  function timeAgo(createdAt) {
    const pastMs = new Date(createdAt).getTime();
    if (Number.isNaN(pastMs)) return "";
    const diffSec = Math.floor((Date.now() - pastMs) / 1000);

    if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  if (!isOpen) return null;

  const CommentItem = ({ comment, level = 0 }) => (
    <div className={styles.commentCard} style={{ marginLeft: level * 14 }}>
      <img
        className={styles.avatar}
        src={comment.user?.photoUrl || DEFAULT_AVATAR}
        alt="avatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_AVATAR;
        }}
      />
      <div className={styles.commentBody}>
        <div className={styles.commentHeader}>
          <span className={styles.username}>
            {comment.user?.fullName || "User"}
          </span>
          <button
            className={`${styles.likeBtn} ${
              likedComments[comment._id] ? styles["btn-orange"] : ""
            }`}
            onClick={() => handleLikeComment(comment._id)}
            type="button"
          >
            ❤️ {comment.likesCount || 0}
          </button>
        </div>

        <div className={styles.commentText}>{comment.text}</div>

        <div className={styles.commentFooter}>
          <small className={styles.timestamp}>
            {timeAgo(comment.createdAt)}
          </small>
          <button
            className={styles.actionLink}
            onMouseDown={(e) => e.preventDefault()} // don't move focus to the button
            onClick={() => handleReply(comment)}
            type="button"
          >
            Reply
          </button>
          {currentUser &&
            comment.user &&
            (comment.user._id === currentUser._id ||
              comment.user._id === currentUser.id) && (
              <button
                className={styles.deleteLink}
                onClick={() => confirmDeleteOpen(comment._id)}
                type="button"
              >
                Delete
              </button>
            )}
        </div>

        {replyTo && replyTo._id === comment._id && (
          <div className={styles.replyInput}>
            <img
              className={styles.avatarSmall}
              src={currentUser?.photoUrl || DEFAULT_AVATAR}
              alt="me"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <input
              type="text"
              ref={replyInputRef}
              tabIndex={0}
              autoFocus // extra safety: keep focus here
              value={replyText ?? ""} // ensure not null
              onChange={(e) => {
                setReplyText(e.target.value);
                if (replyError) setReplyError(null);
              }}
              placeholder={`Reply to ${comment.user?.fullName || "user"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitReply(comment._id);
                }
              }}
            />
            {replyError && (
              <div style={{ color: "#e53935", marginLeft: 8, fontSize: 12 }}>
                {replyError}
              </div>
            )}
            <button
              className={styles.sendBtn}
              onMouseDown={(e) => e.preventDefault()} // keep caret when clicking send
              onClick={() => submitReply(comment._id)}
              disabled={!replyText.trim()}
              type="button"
            >
              ➤
            </button>
            <button
              className={styles["btn-grey"]}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setReplyTo(null);
                setReplyText("");
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        )}

        {(comment.replies || []).map((r) => (
          <CommentItem key={r._id} comment={r} level={level + 1} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.commentsOverlay}>
      <div className={styles.commentsModal}>
        <div className={styles.commentsHeader}>
          <h3>Comments</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <div className={styles.commentsList} ref={listRef}>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>

        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <img
            className={styles.avatarSmall}
            src={currentUser?.photoUrl || DEFAULT_AVATAR}
            alt="me"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={loading}
          />
          <button
            className={styles.sendBtn}
            type="submit"
            disabled={loading || !newComment.trim()}
          >
            ➤
          </button>
        </form>

        {confirmDelete.open && (
          <div className={styles.confirmModalBackdrop}>
            <div className={styles.confirmModal}>
              <p>Are you sure you want to delete this comment?</p>
              <div className={styles.confirmModalActions}>
                <button
                  className={styles["btn-grey"]}
                  onClick={confirmDeleteCancel}
                >
                  Cancel
                </button>
                <button
                  className={styles["btn-delete"]}
                  onClick={handleDeleteComment}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoComments;
