import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../../../shared/components/layout/BottomNav/BottomNav";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/user', {
          withCredentials: true
        });
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>Loading orders...</div>;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px" }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <h1>My Orders</h1>
      </div>
      
      <div style={{ padding: "1rem" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            No orders yet
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order._id} 
              onClick={() => navigate(`/orders/${order._id}`)}
              style={{ 
                padding: "1rem", 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                marginBottom: "1rem",
                cursor: "pointer",
                background: "white"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p style={{ color: "#666", margin: "4px 0" }}>
                    Status: <span style={{ fontWeight: "bold", color: order.status === 'COMPLETED' ? '#16a34a' : '#f59e0b' }}>
                      {order.status}
                    </span>
                  </p>
                  <p style={{ fontSize: "12px", color: "#999" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: "bold" }}>
                    ${order.items?.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0).toFixed(2)}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    {order.items?.length} items
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default UserOrdersPage;