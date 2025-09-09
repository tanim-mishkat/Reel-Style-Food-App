import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { orderService, reviewService } from "../../../shared/services/api";
import Loading from "../../../shared/components/ui/Loading/Loading";
import pageStyles from "../../../shared/components/ui/Page/Page.module.css";
import styles from "./OrderDetail.module.css";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const statusSteps = [
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "DELIVERED",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        const newOrder = response.data.order;

        // Check if status changed and trigger notification
        if (order && order.status !== newOrder.status) {
          const statusMessages = {
            ACCEPTED: "✅ Your order has been accepted!",
            PREPARING: "👨🍳 Your order is being prepared!",
            READY: "🎉 Your order is ready for pickup!",
            COMPLETED: "✨ Order completed! Please rate your experience.",
          };

          const message =
            statusMessages[newOrder.status] ||
            `Order status: ${newOrder.status}`;

          // Trigger toast and bell notifications
          window.dispatchEvent(
            new CustomEvent("showToast", { detail: message })
          );
          window.dispatchEvent(
            new CustomEvent("triggerBell", { detail: message })
          );
        }

        setOrder(newOrder);
      } catch (error) {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [id, order]);

  useEffect(() => {
    if (order && order.status === "COMPLETED" && !reviewSubmitted) {
      setShowReviewDialog(true);
    }
  }, [order, reviewSubmitted]);

  const handleReviewSubmit = async () => {
    try {
      await reviewService.createReview({
        orderId: order._id,
        stars: selectedStars,
      });
      setReviewSubmitted(true);
      setShowReviewDialog(false);
    } catch (error) {
      console.error("Failed to submit review");
    }
  };

  if (loading) return <Loading />;
  if (!order) return <div className={styles.container}>Order not found</div>;

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className={pageStyles.pageContainer}>
      <div className={styles.container}>
        <h1>Order #{order._id.slice(-6)}</h1>

        <div className={styles.sectionMargin}>
          <h3>Order Status: {order.status}</h3>
          <div className={styles.statusSteps}>
            {statusSteps.map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={styles.stepCircle}
                  data-active={index <= currentStepIndex}
                >
                  {index + 1}
                </div>
                <div
                  className={styles.stepLabel}
                  data-active={index <= currentStepIndex}
                >
                  {step}
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={styles.stepBar}
                    data-filled={index < currentStepIndex}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={`${pageStyles.cardNoBorder} ${styles.detailsSection}`}>
          <h3>Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className={styles.itemsRow}>
              <span>
                {item.name} x {item.qty}
              </span>
              <span>${(item.unitPrice * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className={pageStyles.cardNoBorder}>
          <h3>Timeline</h3>
          {order.timeline.map((entry, index) => (
            <div
              key={index}
              className={`${styles.timelineEntry} ${
                index === order.timeline.length - 1 ? styles.timelineLast : ""
              }`}
            >
              <div className={styles.statusText}>{entry.status}</div>
              <div className={styles.mutedSmall}>
                {new Date(entry.at).toLocaleString()}
              </div>
              {entry.note && (
                <div className={styles.noteText}>{entry.note}</div>
              )}
            </div>
          ))}
        </div>

        {showReviewDialog && (
          <div className={pageStyles.modalBackdrop}>
            <div className={pageStyles.modalContent}>
              <h3>Rate your order</h3>
              <div className={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedStars(star)}
                    className={`${styles.starBtn} ${
                      star <= selectedStars ? styles.starSelected : ""
                    }`}
                  >
                    \u2605
                  </button>
                ))}
              </div>
              <div className={styles.actionRow}>
                <button
                  onClick={() => setShowReviewDialog(false)}
                  className={styles.btnGhost}
                >
                  Skip
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={selectedStars === 0}
                  className={styles.btnPrimary}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
