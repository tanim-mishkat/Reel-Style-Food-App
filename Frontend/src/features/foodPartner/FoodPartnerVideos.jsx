import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { foodPartnerService } from "../../shared/services/api";
import { useVideoPlayer } from "../../shared/hooks/useVideoPlayer";
import { useVideoActions } from "../../shared/hooks/useVideoActions";
import VideoPlayer from "../video/components/VideoPlayer/VideoPlayer";
import VideoControls from "../video/components/VideoControls/VideoControls";
import VideoActions from "../video/components/VideoActions/VideoActions";
import VideoInfo from "../video/components/VideoInfo/VideoInfo";
import VideoComments from "../video/components/VideoComments/VideoComments";
import VideoProgressBar from "../video/components/VideoProgressBar/VideoProgressBar";
import BottomNav from "../../shared/components/layout/BottomNav/BottomNav";
import styles from "../home/pages/HomePage.module.css";

const FoodPartnerVideos = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const {
    containerRef,
    videoRefs,
    mutedVideos,
    currentTimes,
    durations,
    pausedVideos,
    togglePlayPause,
    toggleMute,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
  } = useVideoPlayer(videos);

  const {
    likedVideos,
    savedVideos,
    videoCounts,
    initializeVideoStates,
    handleLike,
    handleSave,
    handleCommentAdded,
  } = useVideoActions();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await foodPartnerService.getFoodPartnerVideos(id);
        const foodItems = response.data.foodItems;
        setVideos(foodItems);
        initializeVideoStates(foodItems);
      } catch (err) {
        console.error("Error fetching partner videos:", err);
      }
    };

    fetchVideos();
  }, [id, initializeVideoStates]);

  const handleComment = (videoId) => {
    setActiveVideoId(videoId);
    setCommentsOpen(true);
  };

  return (
    <div className={styles.homeContainer} ref={containerRef}>
      {videos.map((video) => (
        <div key={video._id} className={styles.videoSection}>
          <VideoPlayer
            video={video}
            videoRef={(el) => (videoRefs.current[video._id] = el)}
            muted={mutedVideos[video._id] === true}
            onTimeUpdate={() => handleTimeUpdate(video._id)}
            onLoadedMetadata={() => handleLoadedMetadata(video._id)}
            onVideoClick={() => togglePlayPause(video._id)}
          />
          <VideoProgressBar
            currentTime={currentTimes[video._id] || 0}
            duration={durations[video._id] || 0}
          />
          <div className={styles.videoOverlay}>
            <VideoControls
              isPaused={pausedVideos[video._id]}
              isMuted={mutedVideos[video._id]}
              onPlayPause={() => togglePlayPause(video._id)}
              onMute={() => toggleMute(video._id)}
            />
            <VideoActions
              videoId={video._id}
              isLiked={likedVideos[video._id]}
              isSaved={savedVideos[video._id]}
              likesCount={videoCounts[video._id]?.likes || 0}
              savesCount={videoCounts[video._id]?.saves || 0}
              commentsCount={videoCounts[video._id]?.comments || 0}
              onLike={handleLike}
              onSave={handleSave}
              onComment={handleComment}
            />
            <div className={styles.videoInfoContainer}>
              <h3 className={styles.videoTitle}>{video.name}</h3>
              <VideoInfo video={video} />
            </div>
          </div>
        </div>
      ))}

      <VideoComments
        videoId={activeVideoId}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        onCommentPosted={(delta) =>
          handleCommentAdded(activeVideoId, delta ?? 1)
        }
      />

      <BottomNav />
    </div>
  );
};

export default FoodPartnerVideos;
