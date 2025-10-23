import { useState, useRef, useEffect } from 'react';

export const useVideoPlayer = (videos, options = {}) => {
  const containerRef = useRef(null);
  const videoRefs = useRef([]); // assumes you map ids -> nodes elsewhere
  const [mutedVideos, setMutedVideos] = useState({});
  const [currentTimes, setCurrentTimes] = useState({});
  const [durations, setDurations] = useState({});
  const [pausedVideos, setPausedVideos] = useState({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [savedTimes, setSavedTimes] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize all videos as muted and set up initial state
  useEffect(() => {
    if ((videos || []).length > 0 && !isInitialized) {
      // Initialize all videos as muted
      const initialMutedState = {};
      videos.forEach((video) => {
        initialMutedState[video._id] = true;
      });
      setMutedVideos(initialMutedState);

      const startVideoId = options.startVideoId || null;
      let targetIndex = 0;
      if (startVideoId) {
        const idx = videos.findIndex((v) => v._id === startVideoId);
        if (idx >= 0) targetIndex = idx;
      }

      const targetId = videos[targetIndex]._id;
      const targetVideo = videoRefs.current[targetId];

      if (targetVideo) {
        const container = containerRef.current;
        const navbarHeight = window.innerWidth <= 480 ? 56 : 64;
        const videoHeight = window.innerHeight - navbarHeight;
        if (container) {
          container.scrollTo({ top: targetIndex * videoHeight, behavior: "auto" });
        }
        try {
          targetVideo.muted = true; // required for autoplay
          targetVideo.setAttribute('playsinline', '');
          const p = targetVideo.play();
          if (p && typeof p.catch === 'function') p.catch(() => { });
        } catch {
          // ignore NotAllowedError; user can tap to play
        }
        setCurrentVideoIndex(targetIndex);
        setIsInitialized(true);
      }
    }
  }, [videos, isInitialized, options.startVideoId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;

      setTimeout(() => {
        // Calculate proper video height accounting for navbar
        const navbarHeight = window.innerWidth <= 480 ? 56 : 64; // 3.5rem or 4rem
        const videoHeight = window.innerHeight - navbarHeight;
        const scrollTop = container.scrollTop ?? 0;
        const newIndex = Math.round(scrollTop / videoHeight);

        // Pause all videos first
        Object.keys(videoRefs.current).forEach((id) => {
          const video = videoRefs.current[id];
          if (video && !video.paused) {
            setSavedTimes((prev) => ({
              ...prev,
              [id]: video.currentTime,
            }));
            video.pause();
            setPausedVideos((prev) => ({ ...prev, [id]: true }));
          }
        });

        // Play only the current video
        if (videos[newIndex]) {
          const newId = videos[newIndex]._id;
          const newVideo = videoRefs.current[newId];
          if (newVideo) {
            const savedTime = savedTimes[newId];
            if (savedTime != null) newVideo.currentTime = savedTime;
            if (!pausedVideos[newId]) {
              try {
                // Set mute state based on current muted state
                newVideo.muted = mutedVideos[newId] !== false;
                newVideo.setAttribute('playsinline', '');
                const p = newVideo.play();
                if (p && typeof p.catch === 'function') p.catch(() => { });
                setPausedVideos((prev) => ({ ...prev, [newId]: false }));
              } catch {
                // ignore
              }
            }
          }
        }

        setCurrentVideoIndex(newIndex);

        container.scrollTo({
          top: newIndex * (window.innerHeight - navbarHeight),
          behavior: "smooth",
        });

        isScrolling = false;
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, videos, savedTimes, pausedVideos]);

  const togglePlayPause = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    if (!videoEl) return;

    if (videoEl.paused) {
      // Pause all other videos before playing this one
      Object.keys(videoRefs.current).forEach((id) => {
        if (id !== videoId) {
          const otherVideo = videoRefs.current[id];
          if (otherVideo && !otherVideo.paused) {
            otherVideo.pause();
            setPausedVideos((prev) => ({ ...prev, [id]: true }));
          }
        }
      });

      try {
        // Set mute state based on current muted state
        videoEl.muted = mutedVideos[videoId] !== false;
        videoEl.setAttribute('playsinline', '');
        const p = videoEl.play();
        if (p && typeof p.catch === 'function') p.catch(() => { });
      } catch {/* ignore */ }
      setPausedVideos((prev) => ({ ...prev, [videoId]: false }));
    } else {
      videoEl.pause();
      setPausedVideos((prev) => ({ ...prev, [videoId]: true }));
    }
  };

  const toggleMute = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    if (!videoEl) return;

    const newMutedState = !mutedVideos[videoId];
    videoEl.muted = newMutedState;

    setMutedVideos((prev) => ({
      ...prev,
      [videoId]: newMutedState,
    }));
  };

  const handleTimeUpdate = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    if (!videoEl) return;
    setCurrentTimes((prev) => ({
      ...prev,
      [videoId]: videoEl.currentTime,
    }));
  };

  const handleLoadedMetadata = (videoId) => {
    const videoEl = videoRefs.current[videoId];
    if (!videoEl) return;
    setDurations((prev) => ({
      ...prev,
      [videoId]: videoEl.duration,
    }));
  };

  const handleSeek = (videoId, value) => {
    const videoEl = videoRefs.current[videoId];
    if (videoEl) videoEl.currentTime = value;
  };

  const pauseAllVideos = () => {
    Object.keys(videoRefs.current).forEach((id) => {
      const video = videoRefs.current[id];
      if (video && !video.paused) {
        video.pause();
        setPausedVideos((prev) => ({ ...prev, [id]: true }));
      }
    });
  };

  // Pause all videos when component unmounts or page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAllVideos();
      }
    };

    const handleBeforeUnload = () => {
      pauseAllVideos();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      pauseAllVideos(); // Pause all videos on cleanup
    };
  }, []);

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
    handleSeek,
    pauseAllVideos,
  };
};
