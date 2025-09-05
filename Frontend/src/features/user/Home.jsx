import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
                {pausedVideos[video._id] ? "▶️" : "⏸️"}
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
                {mutedVideos[video._id] ? "🔇" : "🔊"}
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
            <div className="video-info-bottom">
              <h3 className="partner-name">{video.name}</h3>
              <p className="video-description">{video.description}</p>
              <Link
                to={`/food-partner/${video.foodPartner}`}
                className="visit-store-btn"
              >
                Visit Store
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
