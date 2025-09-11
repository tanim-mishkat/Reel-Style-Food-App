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

  // NEW: persist “done/dismissed” per order
  const dismissedKey = `reviewDone:${id}`;
  const [reviewDone, setReviewDone] = useState(
    () => localStorage.getItem(dismissedKey) === "1"
  );

  const statusSteps = ["PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED"];

  // Polling — only depends on id
  useEffect(() => {
    let alive = true;

    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        const newOrder = response.data.order;

        // toast/bell if status changed
        setOrder((prev) => {
          if (prev && prev.status !== newOrder.status) {
            const statusMessages = {
              ACCEPTED: "✅ Your order has been accepted!",
              PREPARING: "👨🍳 Your order is being prepared!",
              READY: "🎉 Your order is ready for pickup!",
              COMPLETED: "✨ Order completed! Please rate your experience.",
            };
            const message =
              statusMessages[newOrder.status] ||
              `Order status: ${newOrder.status}`;
            window.dispatchEvent(
              new CustomEvent("showToast", { detail: message })
            );
            window.dispatchEvent(
              new CustomEvent("triggerBell", { detail: message })
            );
          }
          return newOrder;
        });
      } catch {
        console.error("Failed to fetch order");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [id]);

  // Open dialog only if completed AND not done (submitted or dismissed)
  useEffect(() => {
    if (order?.status === "COMPLETED" && !reviewSubmitted && !reviewDone) {
      setShowReviewDialog(true);
    } else {
      setShowReviewDialog(false);
    }
  }, [order?.status, reviewSubmitted, reviewDone]);

  const handleSkip = () => {
    setShowReviewDialog(false);
    setReviewDone(true);
    localStorage.setItem(dismissedKey, "1");
  };

  const handleReviewSubmit = async () => {
    try {
      await reviewService.createReview({
        orderId: order._id,
        stars: Number(selectedStars),
      });
      setReviewSubmitted(true);
      setReviewDone(true);
      localStorage.setItem(dismissedKey, "1");
      window.dispatchEvent(
        new CustomEvent("showToast", { detail: "Thanks for your review!" })
      );
    } catch (error) {
      console.error("Failed to submit review", error?.message || error);
      window.dispatchEvent(
        new CustomEvent("showToast", { detail: "Failed to submit review" })
      );
    } finally {
      // Ensure it closes regardless of request outcome
      setShowReviewDialog(false);
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
          <div
            className={pageStyles.modalBackdrop}
            onClick={handleSkip}
            aria-hidden
          >
            <div
              className={pageStyles.modalContent}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Rate your order"
            >
              <h3>Rate your order</h3>
              <div
                className={styles.starRow}
                role="radiogroup"
                aria-label="Rate this order"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedStars(star)}
                    aria-pressed={star <= selectedStars}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    className={`${styles.starBtn} ${
                      star <= selectedStars ? styles.starSelected : ""
                    }`}
                  >
                    {"★"}
                  </button>
                ))}
              </div>
              <div className={styles.actionRow}>
                <button onClick={handleSkip} className={styles.btnGhost}>
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
