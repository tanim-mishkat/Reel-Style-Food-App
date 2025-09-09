import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";
import {
  menuService,
  foodPartnerService,
  reviewService,
  followService,
} from "../../shared/services/api";
import useCart from "../../shared/hooks/useCart";
import CartIcon from "../../shared/components/ui/CartIcon/CartIcon";
import styles from "./Profile.module.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");
  const [reviewStats, setReviewStats] = useState({
    averageStars: 0,
    totalReviews: 0,
  });
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
          const isUserFollowing = followedResponse.data.partners.some(
            (f) => f.partner._id === id
          );
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
      setFollowerCount((prev) =>
        response.data.following ? prev + 1 : prev - 1
      );
    } catch (error) {
      navigate("/auth/user/login");
    }
  };

  if (loading) {
    return <div className={styles.profileLoading}>Loading...</div>;
  }

  return (
    <>
      <CartIcon />
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <img
              src={profile.avatar || "/default_image.jpeg"}
              alt={profile.fullName}
            />
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              <h1>{profile.fullName}</h1>
              <button
                className={`${styles.contactBtn} ${
                  isFollowing ? styles.following : ""
                }`}
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{videos.length}</span>
                <span className={styles.statLabel}>posts</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {reviewStats.averageStars}⭐
                </span>
                <span className={styles.statLabel}>rating</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {reviewStats.totalReviews}
                </span>
                <span className={styles.statLabel}>reviews</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{followerCount}</span>
                <span className={styles.statLabel}>followers</span>
              </div>
            </div>

            <div className={styles.profileAddress}>
              <p>📍 {profile.address}</p>
            </div>

            <div className={styles.profileBio}>
              <p>
                Contact: {profile.contactName} | Phone: {profile.phone}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.contentTabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "videos" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("videos")}
            >
              🎬 VIDEOS
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "menu" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("menu")}
            >
              🍽️ MENU
            </button>
            <button className={styles.tab}>📋 TAGGED</button>
          </div>

          {activeTab === "videos" && (
            <div className={styles.postsGrid}>
              {videos.map((video) => (
                <div
                  key={video._id}
                  className={styles.postItem}
                  onClick={() =>
                    navigate(ROUTES.FOOD_PARTNER_VIDEOS.replace(":id", id))
                  }
                  onMouseEnter={(e) => {
                    const videoEl = e.currentTarget.querySelector("video");
                    videoEl.play();
                  }}
                  onMouseLeave={(e) => {
                    const videoEl = e.currentTarget.querySelector("video");
                    videoEl.pause();
                    videoEl.currentTime = 0;
                  }}
                >
                  <video src={video.video} preload="metadata" muted loop />
                  <div className={styles.videoIndicator}>📹</div>
                  <div className={styles.postOverlay}>
                    <div className={styles.overlayContent}>
                      <h4 className={styles.videoTitle}>{video.name}</h4>
                      <span className={styles.postViews}>
                        ❤️ {video.likesCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "menu" && (
            <div className={styles.menuList}>
              {menuItems.map((item) => (
                <div key={item._id} className={styles.menuItem}>
                  <div className={styles.menuItemInfo}>
                    <h3 className={styles.menuItemName}>{item.name}</h3>
                    <p className={styles.menuItemDescription}>
                      {item.description}
                    </p>
                    <div className={styles.menuItemDetails}>
                      <span className={styles.price}>${item.price}</span>
                      {item.prepTime && (
                        <span className={styles.prepTime}>
                          ⏱️ {item.prepTime.min}-{item.prepTime.max} min
                        </span>
                      )}
                      <span
                        className={`${styles.availability} ${
                          item.isAvailable
                            ? styles.available
                            : styles.unavailable
                        }`}
                      >
                        {item.isAvailable ? "✅ Available" : "❌ Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.menuItemActions}>
                    {item.photoUrl && (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className={styles.menuItemImage}
                      />
                    )}
                    <button
                      className={styles.addToCartBtn}
                      disabled={!item.isAvailable}
                      onClick={() => {
                        try {
                          addItem({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            partnerId: id,
                            partnerName: profile.fullName,
                          });
                          alert(`Added ${item.name} to cart!`);
                        } catch (error) {
                          // If not authenticated, redirect to login
                          navigate("/auth/user/login");
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
