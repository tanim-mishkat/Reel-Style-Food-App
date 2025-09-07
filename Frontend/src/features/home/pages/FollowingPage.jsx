import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { followService } from "../../../shared/services/api";
import { useVideoPlayer } from "../../../shared/hooks/useVideoPlayer";
import { useVideoActions } from "../../../shared/hooks/useVideoActions";
import VideoPlayer from "../../video/components/VideoPlayer/VideoPlayer";
import VideoControls from "../../video/components/VideoControls/VideoControls";
import VideoActions from "../../video/components/VideoActions/VideoActions";
import VideoInfo from "../../video/components/VideoInfo/VideoInfo";
import VideoComments from "../../video/components/VideoComments/VideoComments";
import VideoProgressBar from "../../video/components/VideoProgressBar/VideoProgressBar";
import BottomNav from "../../../shared/components/layout/BottomNav/BottomNav";
import styles from "./HomePage.module.css";

const FollowingPage = () => {
  const navigate = useNavigate();
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
  } = useVideoPlayer(videos);

  const {
    likedVideos,
    savedVideos,
    videoCounts,
    initializeVideoStates,
    handleLike,
    handleSave,
  } = useVideoActions();

  const [followedPartners, setFollowedPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedData = async () => {
      try {
        const [feedResponse, partnersResponse] = await Promise.all([
          followService.getFollowedFeed(),
          followService.getFollowedPartners()
        ]);
        const foodItems = feedResponse.data.foodItems;
        setVideos(foodItems);
        setFollowedPartners(partnersResponse.data.partners);
        initializeVideoStates(foodItems);
      } catch (err) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedData();
  }, [initializeVideoStates]);

  const handleComment = (videoId) => {
    setActiveVideoId(videoId);
    setCommentsOpen(true);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "var(--surface-light)"
      }}>
        <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-body)" }}>Loading...</div>
      </div>
    );
  }

  // Not following anyone
  if (followedPartners.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-xl)",
        textAlign: "center",
        background: "var(--surface-light)"
      }}>
        <div style={{
          fontSize: "4rem",
          marginBottom: "var(--spacing-lg)",
          opacity: "0.3"
        }}>👥</div>
        <h2 style={{
          fontSize: "var(--text-h2)",
          fontWeight: "600",
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-sm)"
        }}>You're not following anyone yet</h2>
        <p style={{
          color: "var(--text-secondary)",
          marginBottom: "var(--spacing-lg)",
          fontSize: "var(--text-body)",
          maxWidth: "300px"
        }}>Discover amazing restaurants and follow them to see their latest food videos here!</p>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "var(--spacing-md) var(--spacing-xl)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-body)",
            fontWeight: "600",
            cursor: "pointer",
            minHeight: "var(--touch-target)",
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
            transition: "all 0.3s ease"
          }}
        >
          Discover Restaurants
        </button>
        <BottomNav />
      </div>
    );
  }

  // Following but no videos
  if (videos.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-xl)",
        textAlign: "center",
        background: "var(--surface-light)"
      }}>
        <div style={{
          fontSize: "4rem",
          marginBottom: "var(--spacing-lg)",
          opacity: "0.3"
        }}>🎬</div>
        <h2 style={{
          fontSize: "var(--text-h2)",
          fontWeight: "600",
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-sm)"
        }}>No videos yet</h2>
        <p style={{
          color: "var(--text-secondary)",
          marginBottom: "var(--spacing-lg)",
          fontSize: "var(--text-body)",
          maxWidth: "300px"
        }}>The restaurants you follow haven't uploaded any videos yet. Check back later or discover more restaurants!</p>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "var(--spacing-md) var(--spacing-xl)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-body)",
            fontWeight: "600",
            cursor: "pointer",
            minHeight: "var(--touch-target)",
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
            transition: "all 0.3s ease"
          }}
        >
          Explore More
        </button>
        <BottomNav />
      </div>
    );
  }

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
      />

      <BottomNav />
    </div>
  );
};

export default FollowingPage;