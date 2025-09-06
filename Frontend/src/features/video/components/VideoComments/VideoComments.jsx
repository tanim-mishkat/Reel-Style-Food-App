import React, { useState, useEffect } from 'react';
import { foodService } from '../../../../shared/services/api';
import styles from './VideoComments.module.css';

const VideoComments = ({ videoId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments();
    }
  }, [isOpen, videoId]);

  const fetchComments = async () => {
    try {
      const response = await foodService.getComments(videoId);
      setComments(response.data.comments);
    } catch (err) {
      // Handle error silently
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await foodService.addComment(videoId, newComment);
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.commentsOverlay}>
      <div className={styles.commentsModal}>
        <div className={styles.commentsHeader}>
          <h3>Comments</h3>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        
        <div className={styles.commentsList}>
          {comments.map(comment => (
            <div key={comment._id} className={styles.commentItem}>
              <strong>{comment.user.fullName}</strong>
              <p>{comment.text}</p>
              <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
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
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoComments;