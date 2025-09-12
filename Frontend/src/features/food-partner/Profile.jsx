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
import { connectSocket } from "../../shared/realtime/socket.js";

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
        // Partner + videos
        const response = await foodPartnerService.getFoodPartnerById(id);
        const p = response?.data?.foodPartner || null;
        setProfile(p);
        setVideos(Array.isArray(p?.foodItems) ? p.foodItems : []);

        // Menu
        const menuResponse = await menuService.getMenuItems(id);
        setMenuItems(menuResponse?.data?.menuItems || []);

        // Reviews
        const reviewResponse = await reviewService.getPartnerReviews(id);
        setReviewStats(
          reviewResponse?.data || { averageStars: 0, totalReviews: 0 }
        );

        // Following (user-only; ignore errors if not logged in)
        try {
          const followedResponse = await followService.getFollowedPartners();
          const isUserFollowing = (followedResponse?.data?.partners || []).some(
            (f) => f?.partner?._id === id
          );
          setIsFollowing(isUserFollowing);
        } catch {
          /* ignore */
        }

        try {
          const { data } = await followService.getFollowerCount(id);
          setFollowerCount(data?.count ?? 0);
        } catch {
          /* ignore */
        }

        const socket = connectSocket();
        socket.emit("subscribe:partner", id);
        const onCount = ({ partnerId: pid, count }) => {
          if (id === pid) {
            setFollowerCount(count ?? 0);
          }
        };
        socket.on("follow:count", onCount);
        return () => {
          socket.off("follow:count", onCount);
        };
      } catch (error) {
        // could set an error state here
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      const response = await followService.toggleFollow(id);
      const following = !!response?.data?.following;
      setIsFollowing(following);
    } catch {
      // not logged in -> go to login
      navigate("/auth/user/login");
    }
  };

  if (loading) {
    return <div className={styles.profileLoading}>Loading...</div>;
  }

  // Guard for failed load
  if (!profile) {
    return <div className={styles.profileLoading}>Partner not found.</div>;
  }

  return (
    <>
      <CartIcon />
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <img
              src={profile.profileImg || "/default_image.jpeg"}
              alt={profile.fullName || "Food partner"}
            />
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              <h1>{profile.fullName || "Unnamed Partner"}</h1>
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
              <p>📍 {profile.address || ""}</p>
            </div>

            <div className={styles.profileBio}>
              <p>
                Contact: {profile.contactName || "-"} | Phone:{" "}
                {profile.phone || "-"}
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
              <svg
                className={styles.tabIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              VIDEOS
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "menu" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("menu")}
            >
              <svg
                className={styles.tabIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
              </svg>
              MENU
            </button>
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
                >
                  <video src={video.video} preload="metadata" muted loop />
                  <div className={styles.videoOverlay}>
                    <div className={styles.videoStats}>
                      <div className={styles.stat}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span>{video.likesCount || 0}</span>
                      </div>
                      <div className={styles.stat}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                        <span>{video.savedCount || 0}</span>
                      </div>
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
                  {item.photoUrl && (
                    <div className={styles.menuItemImageContainer}>
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className={styles.menuItemImage}
                      />
                    </div>
                  )}
                  <div className={styles.menuItemContent}>
                    <div className={styles.menuItemHeader}>
                      <h3 className={styles.menuItemName}>{item.name}</h3>
                      <div className={styles.menuItemPrice}>${item.price}</div>
                    </div>
                    <p className={styles.menuItemDescription}>
                      {item.description}
                    </p>
                    <div className={styles.menuItemDetails}>
                      {item.prepTime && (
                        <div className={styles.prepTime}>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                          </svg>
                          <span>
                            {item.prepTime.min}-{item.prepTime.max} min
                          </span>
                        </div>
                      )}
                      <div
                        className={`${styles.availability} ${
                          item.isAvailable
                            ? styles.available
                            : styles.unavailable
                        }`}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          {item.isAvailable ? (
                            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                          ) : (
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                          )}
                        </svg>
                        <span>
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`${styles.orderButton} ${
                        !item.isAvailable ? styles.disabled : ""
                      }`}
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
                        } catch {
                          navigate("/auth/user/login");
                        }
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5H5.21L4.27,3H1M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18Z" />
                      </svg>
                      Order Now
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
