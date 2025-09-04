import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;

      setTimeout(() => {
        const scrollTop = container.scrollTop;
        const videoHeight = window.innerHeight;
        const currentIndex = Math.round(scrollTop / videoHeight);

        container.scrollTo({
          top: currentIndex * videoHeight,
          behavior: "smooth",
        });

        isScrolling = false;
      }, 100);
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

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
            className="video-player"
            src={video.video}
            autoPlay
            loop
            playsInline
          />
          <div className="video-overlay">
            <div className="video-info">
              <p className="video-description">{video.description}</p>
              <Link
                to={`/food-partner/${video.foodPartner}`}
                className="visit-store-btn"
              >
                Visit {video.name}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
