import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService, authService, followService } from "../../../shared/services/api";
import BottomNav from "../../../shared/components/layout/BottomNav/BottomNav";
import Input from "../../../shared/components/ui/Input/Input";
import Button from "../../../shared/components/ui/Button/Button";

const UserDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [followedPartners, setFollowedPartners] = useState([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, userResponse] = await Promise.all([
          orderService.getUserOrders(),
          authService.getUserProfile()
        ]);
        
        const newOrders = ordersResponse.data.orders || [];
        
        // Check for status changes in ongoing orders
        if (orders.length > 0) {
          const ongoingOrders = orders.filter(order => !['COMPLETED', 'CANCELLED'].includes(order.status));
          ongoingOrders.forEach(oldOrder => {
            const newOrder = newOrders.find(o => o._id === oldOrder._id);
            if (newOrder && newOrder.status !== oldOrder.status) {
              const statusMessages = {
                'ACCEPTED': '✅ Your order has been accepted!',
                'PREPARING': '👨🍳 Your order is being prepared!',
                'READY': '🎉 Your order is ready for pickup!',
                'COMPLETED': '✨ Order completed! Please rate your experience.'
              };
              
              const message = statusMessages[newOrder.status] || `Order status: ${newOrder.status}`;
              
              // Trigger toast and bell notifications
              window.dispatchEvent(new CustomEvent('showToast', { detail: message }));
              window.dispatchEvent(new CustomEvent('triggerBell', { detail: message }));
            }
          });
        }
        
        setOrders(newOrders);
        setUser(userResponse.data.user);
        setFullName(userResponse.data.user.fullName);
        
        // Fetch followed partners
        try {
          const followResponse = await followService.getFollowedPartners();
          setFollowedPartners(followResponse.data.partners);
        } catch (error) {
          // Handle silently
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setOrders([]);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Poll for order updates every 10 seconds if user has ongoing orders
    const interval = setInterval(() => {
      const ongoingOrders = orders.filter(order => !['COMPLETED', 'CANCELLED'].includes(order.status));
      if (ongoingOrders.length > 0) {
        fetchData();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [orders]);

  const handleUpdateProfile = async () => {
    try {
      const response = await authService.updateUserProfile({ fullName });
      setUser(response.data.user);
      setEditMode(false);
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: 'Profile updated successfully!' 
      }));
    } catch (error) {
      console.error('Failed to update profile');
    }
  };

  const ongoingOrders = orders.filter(order => !['COMPLETED', 'CANCELLED'].includes(order.status));
  const completedOrders = orders.filter(order => ['COMPLETED', 'CANCELLED'].includes(order.status));
  const totalSpent = orders.reduce((sum, order) => 
    sum + (order.items?.reduce((itemSum, item) => itemSum + (item.unitPrice * item.qty), 0) || 0), 0
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>Loading...</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>Please log in to view dashboard</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px", background: "#f8f9fa" }}>
      <div style={{ padding: "1rem", background: "white", borderBottom: "1px solid #ddd" }}>
        <h1>Dashboard</h1>
      </div>

      {/* User Profile Section */}
      {user && (
        <div style={{ padding: "1rem", background: "white", margin: "1rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Profile</h2>
            <button 
              onClick={() => setEditMode(!editMode)}
              style={{ 
                background: "#3b82f6", 
                color: "white", 
                border: "none", 
                padding: "0.5rem 1rem", 
                borderRadius: "6px", 
                cursor: "pointer" 
              }}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {editMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <Button onClick={() => setShowFollowing(true)} style={{ marginTop: "1rem" }}>View Following</Button>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#16a34a" }}>{orders.length}</div>
          <div style={{ fontSize: "0.875rem", color: "#666" }}>Total Orders</div>
        </div>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>{ongoingOrders.length}</div>
          <div style={{ fontSize: "0.875rem", color: "#666" }}>Ongoing</div>
        </div>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>${totalSpent.toFixed(2)}</div>
          <div style={{ fontSize: "0.875rem", color: "#666" }}>Total Spent</div>
        </div>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{followedPartners.length}</div>
          <div style={{ fontSize: "0.875rem", color: "#666" }}>Following</div>
        </div>
      </div>

      {/* Ongoing Orders */}
      {ongoingOrders.length > 0 && (
        <div style={{ padding: "1rem" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Ongoing Orders</h2>
          {ongoingOrders.map((order) => (
            <div 
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              style={{ 
                background: "white", 
                padding: "1rem", 
                borderRadius: "8px", 
                marginBottom: "1rem",
                cursor: "pointer",
                border: "1px solid #e5e7eb"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>Order #{order._id.slice(-6)}</h3>
                  <div style={{ 
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    background: order.status === 'PLACED' ? '#fef3c7' : 
                               order.status === 'PREPARING' ? '#fed7aa' : '#dcfce7',
                    color: order.status === 'PLACED' ? '#92400e' : 
                           order.status === 'PREPARING' ? '#c2410c' : '#166534'
                  }}>
                    {order.status}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold" }}>
                    ${order.items?.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>
                    {order.items?.length} items
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Recent Orders</h2>
        {completedOrders.slice(0, 5).map((order) => (
          <div 
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            style={{ 
              background: "white", 
              padding: "1rem", 
              borderRadius: "8px", 
              marginBottom: "1rem",
              cursor: "pointer",
              border: "1px solid #e5e7eb"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: "0 0 0.25rem 0" }}>Order #{order._id.slice(-6)}</h4>
                <div style={{ fontSize: "0.75rem", color: "#666" }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>
                  ${order.items?.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0).toFixed(2)}
                </div>
                <div style={{ 
                  fontSize: "0.75rem",
                  color: order.status === 'COMPLETED' ? '#16a34a' : '#dc2626'
                }}>
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {orders.length > 5 && (
          <button 
            onClick={() => navigate('/orders')}
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              background: "#f3f4f6", 
              border: "none", 
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            View All Orders
          </button>
        )}
      </div>

      {/* Following Modal */}
      {showFollowing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%', maxHeight: '70vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Following ({followedPartners.length})</h3>
              <button onClick={() => setShowFollowing(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            {followedPartners.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Not following any partners yet</p>
            ) : (
              followedPartners.map((follow) => (
                <div key={follow._id} style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{follow.partner.fullName}</span>
                  <button 
                    onClick={() => navigate(`/food-partner/${follow.partner._id}`)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default UserDashboardPage;