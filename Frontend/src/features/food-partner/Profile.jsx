import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";
import { menuService, foodPartnerService, reviewService, followService } from "../../shared/services/api";
import { useCart } from "../../shared/contexts/CartContext";
import CartIcon from "../../shared/components/ui/CartIcon/CartIcon";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [reviewStats, setReviewStats] = useState({ averageStars: 0, totalReviews: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await foodPartnerService.getFoodPartnerById(id);
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
        
        const menuResponse = await menuService.getMenuItems(id);
        setMenuItems(menuResponse.data.menuItems);
        
        const reviewResponse = await reviewService.getPartnerReviews(id);
        setReviewStats(reviewResponse.data);
        
        // Check if user is following this partner
        try {
          const followedResponse = await followService.getFollowedPartners();
          const isUserFollowing = followedResponse.data.partners.some(f => f.partner._id === id);
          setIsFollowing(isUserFollowing);
        } catch (error) {
          // User not logged in
        }
        
        setLoading(false);
      } catch (error) {
        // Handle error silently
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      const response = await followService.followPartner(id);
      setIsFollowing(response.data.following);
      setFollowerCount(prev => response.data.following ? prev + 1 : prev - 1);
    } catch (error) {
      navigate('/auth/user/login');
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <>
      <CartIcon />
      <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar || "/default_image.jpeg"} alt={profile.fullName} />
        </div>

        <div className="profile-info">
          <div className="profile-name">
            <h1>{profile.fullName}</h1>
            <button className={`contact-btn ${isFollowing ? 'following' : ''}`} onClick={handleFollow}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{videos.length}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat">
              <span className="stat-number">{reviewStats.averageStars}⭐</span>
              <span className="stat-label">rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">{reviewStats.totalReviews}</span>
              <span className="stat-label">reviews</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followerCount}</span>
              <span className="stat-label">followers</span>
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
          <button 
            className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            🎬 VIDEOS
          </button>
          <button 
            className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            🍽️ MENU
          </button>
          <button className="tab">📋 TAGGED</button>
        </div>

        {activeTab === 'videos' && (
          <div className="posts-grid">
            {videos.map((video) => (
              <div 
                key={video._id} 
                className="post-item"
                onClick={() => navigate(ROUTES.FOOD_PARTNER_VIDEOS.replace(':id', id))}
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
                    <span className="post-views">❤️ {video.likesCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="menu-list">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-item">
                <div className="menu-item-info">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-details">
                    <span className="price">${item.price}</span>
                    {item.prepTime && (
                      <span className="prep-time">
                        ⏱️ {item.prepTime.min}-{item.prepTime.max} min
                      </span>
                    )}
                    <span className={`availability ${item.isAvailable ? 'available' : 'unavailable'}`}>
                      {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="menu-item-actions">
                  {item.photoUrl && (
                    <img src={item.photoUrl} alt={item.name} className="menu-item-image" />
                  )}
                  <button 
                    className="add-to-cart-btn"
                    disabled={!item.isAvailable}
                    onClick={() => {
                      console.log('Adding item:', item);
                      try {
                        addItem({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          partnerId: id,
                          partnerName: profile.fullName
                        });
                        alert(`Added ${item.name} to cart!`);
                      } catch (error) {
                        // If not authenticated, redirect to login
                        navigate('/auth/user/login');
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;
