import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/food-partner/${id}`,
          { withCredentials: true }
        );
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchProfile();
    console.log(profile);
  }, [id]);

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar || "/default_image.jpeg"} alt={profile.fullName} />
        </div>

        <div className="profile-info">
          <div className="profile-name">
            <h1>{profile.fullName}</h1>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{videos.length}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.5⭐</span>
              <span className="stat-label">rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">reviews</span>
            </div>
          </div>

          <div className="profile-address">
            <p>📍 {profile.address}</p>
          </div>

          <div className="profile-bio">
            <p>
              Contact: {profile.contactName} | Phone: {profile.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="content-tabs">
          <button className="tab active">🎬 VIDEOS</button>
          <button className="tab">📋 TAGGED</button>
        </div>

        <div className="posts-grid">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className="post-item"
              onMouseEnter={(e) => {
                const videoEl = e.currentTarget.querySelector('video');
                videoEl.play();
              }}
              onMouseLeave={(e) => {
                const videoEl = e.currentTarget.querySelector('video');
                videoEl.pause();
                videoEl.currentTime = 0;
              }}
            >
              <video src={video.video} preload="metadata" muted loop />
              <div className="video-indicator">📹</div>
              <div className="post-overlay">
                <div className="overlay-content">
                  <h4 className="video-title">{video.name}</h4>
                  <span className="post-views">❤️ {video.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
