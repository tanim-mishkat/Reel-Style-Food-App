import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BottomNav from "../../components/common/BottomNav";
import "./Home.css";

const Home = () => {
  const containerRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const [mutedVideos, setMutedVideos] = useState({});
  const [currentTimes, setCurrentTimes] = useState({});
  const [durations, setDurations] = useState({});
  const [pausedVideos, setPausedVideos] = useState({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [savedTimes, setSavedTimes] = useState({});
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});

  useEffect(() => {
    const container = containerRef.current;
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;

      setTimeout(() => {
        const scrollTop = container.scrollTop;
        const videoHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / videoHeight);

        // Pause previous video and save its time
        if (currentVideoIndex !== newIndex && videos[currentVideoIndex]) {
          const prevVideo = videoRefs.current[videos[currentVideoIndex]._id];
          if (prevVideo && !prevVideo.paused) {
            setSavedTimes((prev) => ({
              ...prev,
              [videos[currentVideoIndex]._id]: prevVideo.currentTime,
            }));
            prevVideo.pause();
          }
        }

        // Play new video and restore its saved time
        if (videos[newIndex]) {
          const newVideo = videoRefs.current[videos[newIndex]._id];
          if (newVideo) {
            const savedTime = savedTimes[videos[newIndex]._id];
            if (savedTime) {
              newVideo.currentTime = savedTime;
            }
            if (!pausedVideos[videos[newIndex]._id]) {
              newVideo.play();
            }
          }
        }

        setCurrentVideoIndex(newIndex);
        container.scrollTo({
          top: newIndex * videoHeight,
          behavior: "smooth",
        });

        isScrolling = false;
      }, 100);
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, videos, savedTimes, pausedVideos]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food`, { withCredentials: true })
      .then((response) => {
        setVideos(response.data.foodItems);
      });
  });

  return (
    <div className="home-container" ref={containerRef}>
      {videos.map((video) => (
        <div key={video._id} className="video-section">
          <video
            ref={(el) => (videoRefs.current[video._id] = el)}
            className="video-player"
            src={video.video}
            loop
            playsInline
            muted={mutedVideos[video._id] !== false}
            onTimeUpdate={() => {
              const videoEl = videoRefs.current[video._id];
              setCurrentTimes((prev) => ({
                ...prev,
                [video._id]: videoEl.currentTime,
              }));
            }}
            onLoadedMetadata={() => {
              const videoEl = videoRefs.current[video._id];
              setDurations((prev) => ({
                ...prev,
                [video._id]: videoEl.duration,
              }));
            }}
          />
          <div className="video-overlay">
            <div className="video-controls">
              <button
                className="play-pause-btn"
                onClick={() => {
                  const videoEl = videoRefs.current[video._id];
                  if (videoEl.paused) {
                    videoEl.play();
                    setPausedVideos((prev) => ({
                      ...prev,
                      [video._id]: false,
                    }));
                  } else {
                    videoEl.pause();
                    setPausedVideos((prev) => ({ ...prev, [video._id]: true }));
                  }
                }}
              >
                {pausedVideos[video._id] ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>
              <button
                className="mute-btn"
                onClick={() => {
                  setMutedVideos((prev) => ({
                    ...prev,
                    [video._id]: !prev[video._id],
                  }));
                }}
              >
                {mutedVideos[video._id] ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="video-timeline">
              <input
                type="range"
                min="0"
                max={durations[video._id] || 0}
                value={currentTimes[video._id] || 0}
                onChange={(e) => {
                  const videoEl = videoRefs.current[video._id];
                  videoEl.currentTime = e.target.value;
                }}
                className="timeline-slider"
              />
            </div>
            <div className="side-actions">
              <button
                className={`action-btn like-btn ${
                  likedVideos[video._id] ? "liked" : ""
                }`}
                onClick={() =>
                  setLikedVideos((prev) => ({
                    ...prev,
                    [video._id]: !prev[video._id],
                  }))
                }
              >
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="action-count">23</span>
              </button>

              <button
                className={`action-btn save-btn ${
                  savedVideos[video._id] ? "saved" : ""
                }`}
                onClick={() =>
                  setSavedVideos((prev) => ({
                    ...prev,
                    [video._id]: !prev[video._id],
                  }))
                }
              >
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="action-count">23</span>
              </button>

              <button className="action-btn comment-btn">
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="action-count">45</span>
              </button>
            </div>

            <div className="video-info-bottom">
              <p className="partner-name">{video.name}</p>
              <p className="video-description">{video.description}</p>
              <Link
                to={`/food-partner/${video.foodPartner}`}
                className="visit-store-btn"
              >
                visit {video.foodPartner?.fullName || "store"}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <BottomNav />
    </div>
  );
};

export default Home;
