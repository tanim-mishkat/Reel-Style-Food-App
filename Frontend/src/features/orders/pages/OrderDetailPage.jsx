import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../../shared/services/api";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusSteps = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        setOrder(response.data.order);
      } catch (error) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!order) return <div style={{ padding: "2rem" }}>Order not found</div>;

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1>Order #{order._id.slice(-6)}</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <h3>Order Status: {order.status}</h3>
        <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
          {statusSteps.map((step, index) => (
            <React.Fragment key={step}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: index <= currentStepIndex ? "#16a34a" : "#e5e7eb",
                color: index <= currentStepIndex ? "white" : "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {index + 1}
              </div>
              <div style={{
                fontSize: "12px",
                color: index <= currentStepIndex ? "#16a34a" : "#6b7280",
                margin: "0 8px",
                minWidth: "60px",
                textAlign: "center"
              }}>
                {step}
              </div>
              {index < statusSteps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: index < currentStepIndex ? "#16a34a" : "#e5e7eb",
                  margin: "0 8px"
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Items</h3>
        {order.items.map((item, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
            <span>{item.name} x {item.qty}</span>
            <span>${(item.unitPrice * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Timeline</h3>
        {order.timeline.map((entry, index) => (
          <div key={index} style={{ padding: "0.5rem 0", borderBottom: index < order.timeline.length - 1 ? "1px solid #eee" : "none" }}>
            <div style={{ fontWeight: "bold" }}>{entry.status}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(entry.at).toLocaleString()}
            </div>
            {entry.note && <div style={{ fontSize: "14px", marginTop: "4px" }}>{entry.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailPage;