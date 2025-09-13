import { useState } from 'react';
import { foodService } from '../services/api';

export const useVideoActions = () => {
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});
  const [videoCounts, setVideoCounts] = useState({});

  const initializeVideoStates = (foodItems) => {
    const counts = {};
    const likes = {};
    const saves = {};

    (foodItems || []).forEach((item) => {
      counts[item._id] = {
        likes: item.likesCount || 0,
        saves: item.savedCount || 0,
        comments: item.commentsCount || 0,
      };
      likes[item._id] = !!item.isLiked;
      saves[item._id] = !!item.isSaved;
    });

    setVideoCounts(counts);
    setLikedVideos(likes);
    setSavedVideos(saves);
  };

  const handleLike = async (videoId) => {
    try {
      const response = await foodService.likeFood(videoId);
      const isLiked = response.data.liked;

      setLikedVideos((prev) => ({
        ...prev,
        [videoId]: isLiked,
      }));

      setVideoCounts((prev) => {
        const current = prev[videoId] || { likes: 0, saves: 0, comments: 0 };
        return {
          ...prev,
          [videoId]: {
            ...current,
            likes: Math.max(0, (current.likes || 0) + (isLiked ? 1 : -1)),
          },
        };
      });
    } catch {
      // Handle error silently
    }
  };

  const handleSave = async (videoId) => {
    try {
      const response = await foodService.saveFood(videoId);
      const isSaved = response.data.saved;

      setSavedVideos((prev) => ({
        ...prev,
        [videoId]: isSaved,
      }));

      setVideoCounts((prev) => {
        const current = prev[videoId] || { likes: 0, saves: 0, comments: 0 };
        return {
          ...prev,
          [videoId]: {
            ...current,
            saves: Math.max(0, (current.saves || 0) + (isSaved ? 1 : -1)),
          },
        };
      });
    } catch {
      // Handle error silently
    }
  };

  const handleCommentAdded = (videoId, delta = 1) => {
    setVideoCounts((prev) => {
      const current = prev[videoId] || { likes: 0, saves: 0, comments: 0 };
      return {
        ...prev,
        [videoId]: {
          ...current,
          comments: Math.max(0, (current.comments || 0) + delta),
        },
      };
    });
  };

  return {
    likedVideos,
    savedVideos,
    videoCounts,
    initializeVideoStates,
    handleLike,
    handleSave,
    handleCommentAdded,
  };
};
