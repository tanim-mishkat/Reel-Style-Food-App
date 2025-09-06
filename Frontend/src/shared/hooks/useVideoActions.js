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
    
    foodItems.forEach((item) => {
      counts[item._id] = {
        likes: item.likesCount || 0,
        saves: item.savedCount || 0,
      };
      likes[item._id] = item.isLiked || false;
      saves[item._id] = item.isSaved || false;
    });
    
    setVideoCounts(counts);
    setLikedVideos(likes);
    setSavedVideos(saves);
  };

  const handleLike = async (videoId) => {
    try {
      const response = await foodService.likeFood(videoId);
      const isLiked = response.data.liked;
      
      setLikedVideos(prev => ({
        ...prev,
        [videoId]: isLiked
      }));
      
      setVideoCounts(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          likes: prev[videoId].likes + (isLiked ? 1 : -1)
        }
      }));
    } catch (err) {
      // Handle error silently
    }
  };

  const handleSave = async (videoId) => {
    try {
      const response = await foodService.saveFood(videoId);
      const isSaved = response.data.saved;
      
      setSavedVideos(prev => ({
        ...prev,
        [videoId]: isSaved
      }));
      
      setVideoCounts(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          saves: prev[videoId].saves + (isSaved ? 1 : -1)
        }
      }));
    } catch (err) {
      // Handle error silently
    }
  };

  return {
    likedVideos,
    savedVideos,
    videoCounts,
    initializeVideoStates,
    handleLike,
    handleSave
  };
};