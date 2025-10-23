import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { foodService } from "../../../shared/services/api";
import { ROUTES } from "../../../routes/routeConfig";
import useCart from "../../../shared/hooks/useCart";
import styles from "./StorePage.module.css";

const StorePage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await foodService.getFoodItems();
        setFoodItems(response.data.foodItems);
      } catch (error) {
        console.error("Failed to fetch food items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const handleAddToCart = (item) => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.videoUrl, // Using video thumbnail as image
      partnerId: item.foodPartner._id,
      partnerName: item.foodPartner.fullName,
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading store...</p>
      </div>
    );
  }

  return (
    <div className={styles.storePage}>
      <div className={styles.header}>
        <h1>Food Store</h1>
        <p>Browse and order delicious food items</p>
      </div>

      <div className={styles.foodGrid}>
        {foodItems.map((item) => (
          <div key={item._id} className={styles.foodCard}>
            <div className={styles.foodImage}>
              <video
                src={item.videoUrl}
                muted
                loop
                className={styles.foodVideo}
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
            </div>

            <div className={styles.foodInfo}>
              <h3 className={styles.foodName}>{item.name}</h3>
              <p className={styles.foodDescription}>{item.description}</p>
              <p className={styles.foodPartner}>
                by {item.foodPartner?.fullName || "Unknown Partner"}
              </p>

              <div className={styles.priceSection}>
                <span className={styles.price}>${item.price}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className={styles.addToCartBtn}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {foodItems.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No food items available</h2>
          <p>Check back later for delicious options!</p>
        </div>
      )}

      <div className={styles.checkoutSection}>
        <Link to={ROUTES.CHECKOUT} className={styles.checkoutBtn}>
          Go to Checkout
        </Link>
      </div>
    </div>
  );
};

export default StorePage;
