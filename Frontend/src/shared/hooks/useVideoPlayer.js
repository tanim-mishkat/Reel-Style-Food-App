import { useState, useRef, useEffect } from 'react';

export const useVideoPlayer = (videos) => {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const [mutedVideos, setMutedVideos] = useState({});
  const [currentTimes, setCurrentTimes] = useState({});
  const [durations, setDurations] = useState({});
  const [pausedVideos, setPausedVideos] = useState({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [savedTimes, setSavedTimes] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-play first video when videos load
  useEffect(() => {
    if (videos.length > 0 && !isInitialized) {
      const firstVideo = videoRefs.current[videos[0]._id];
      if (firstVideo) {
        firstVideo.play();
        setIsInitialized(true);
      }
    }
  }, [videos, isInitialized]);

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

  const togglePlayPause = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    if (videoEl.paused) {
      videoEl.play();
      setPausedVideos((prev) => ({
        ...prev,
        [videoId]: false,
      }));
    } else {
      videoEl.pause();
      setPausedVideos((prev) => ({ ...prev, [videoId]: true }));
    }
  };

  const toggleMute = (videoId) => {
    setMutedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const handleTimeUpdate = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    setCurrentTimes((prev) => ({
      ...prev,
      [videoId]: videoEl.currentTime,
    }));
  };

  const handleLoadedMetadata = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    setDurations((prev) => ({
      ...prev,
      [videoId]: videoEl.duration,
    }));
  };

  const handleSeek = (videoId, value) => {
    const videoEl = videoRefs.current[videoId];
    videoEl.currentTime = value;
  };

  return {
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
    handleSeek
  };
};