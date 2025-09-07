import React, { useState, useEffect } from "react";
import { foodPartnerService, menuService, orderService, followService } from "../../../shared/services/api";
import Input from "../../../shared/components/ui/Input/Input";
import Button from "../../../shared/components/ui/Button/Button";

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState('profile');
  const [menuItems, setMenuItems] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', prepTime: '', photoUrl: '' });
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await foodPartnerService.getMyProfile();
        const data = response.data.foodPartner;
        setProfile(data);
        setFullName(data.fullName || "");
        setContactName(data.contactName || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        
        const menuResponse = await menuService.getMyMenuItems();
        setMenuItems(menuResponse.data.menuItems);
        
        const ordersResponse = await orderService.getPartnerOrders();
        setOrders(ordersResponse.data.orders);
        
        const followersResponse = await followService.getPartnerFollowers();
        setFollowers(followersResponse.data.followers);
      } catch (err) {
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await foodPartnerService.updateMyProfile({
        fullName,
        contactName,
        phone,
        address,
      });
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await menuService.createMenuItem(menuForm);
      setMenuItems([...menuItems, response.data.menuItem]);
      setMenuForm({ name: '', description: '', price: '', prepTime: '', photoUrl: '' });
      setShowAddMenu(false);
      setSuccess("Menu item added successfully");
    } catch (err) {
      setError("Failed to add menu item");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item._id !== id));
      setSuccess("Menu item deleted successfully");
    } catch (err) {
      setError("Failed to delete menu item");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      const ordersResponse = await orderService.getPartnerOrders();
      setOrders(ordersResponse.data.orders);
      
      const statusMessages = {
        'ACCEPTED': 'Order accepted - Customer notified',
        'PREPARING': 'Order marked as preparing',
        'READY': 'Order ready for pickup/delivery',
        'COMPLETED': 'Order completed successfully'
      };
      
      // Trigger toast notification
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: statusMessages[newStatus] || `Order status updated to ${newStatus}` 
      }));
      
      // Trigger notification bell for partner
      window.dispatchEvent(new CustomEvent('triggerBell', { 
        detail: statusMessages[newStatus] || `Order status updated to ${newStatus}` 
      }));
      
      setSuccess(statusMessages[newStatus] || `Order status updated to ${newStatus}`);
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'COMPLETED');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');
  console.log('All orders:', orders.length, 'Active:', activeOrders.length, 'Completed:', completedOrders.length);
  const filteredOrders = activeTab === 'completed' ? completedOrders : 
    (statusFilter ? activeOrders.filter(order => order.status === statusFilter) : activeOrders);
  console.log('Active tab:', activeTab, 'Filtered orders:', filteredOrders.length);

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "0 auto", 
      padding: "var(--spacing-md)", 
      overflowX: "hidden",
      minHeight: "100vh",
      background: "var(--surface-light)"
    }}>
      <div style={{ 
        padding: "var(--spacing-lg) 0", 
        borderBottom: "1px solid var(--border)",
        marginBottom: "var(--spacing-lg)"
      }}>
        <h1 style={{ 
          fontSize: "var(--text-h1)", 
          fontWeight: "700", 
          color: "var(--text-primary)",
          margin: "0"
        }}>Partner Dashboard</h1>
      </div>
      
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ 
            padding: "var(--spacing-sm) var(--spacing-md)", 
            background: activeTab === 'profile' ? 'var(--primary)' : 'var(--surface-card)', 
            color: activeTab === 'profile' ? 'white' : 'var(--text-primary)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)', 
            minWidth: '80px', 
            whiteSpace: 'nowrap', 
            fontSize: 'var(--text-caption)', 
            fontWeight: '600',
            minHeight: 'var(--touch-target)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'profile' ? '0 2px 8px rgba(255, 107, 53, 0.2)' : 'var(--shadow-sm)'
          }}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          style={{ padding: "0.75rem 1rem", background: activeTab === 'menu' ? 'var(--primary)' : 'var(--surface-light)', color: activeTab === 'menu' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minWidth: '80px', whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', fontWeight: '500' }}
        >
          Menu
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ padding: "0.75rem 1rem", background: activeTab === 'orders' ? 'var(--primary)' : 'var(--surface-light)', color: activeTab === 'orders' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minWidth: '80px', whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', fontWeight: '500' }}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          style={{ padding: "0.75rem 1rem", background: activeTab === 'completed' ? 'var(--primary)' : 'var(--surface-light)', color: activeTab === 'completed' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minWidth: '80px', whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', fontWeight: '500' }}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('followers')}
          style={{ padding: "0.75rem 1rem", background: activeTab === 'followers' ? 'var(--primary)' : 'var(--surface-light)', color: activeTab === 'followers' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minWidth: '100px', whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', fontWeight: '500' }}
        >
          Followers ({followers.length})
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      
      {activeTab === 'profile' && (
        <div style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-md)",
          padding: "var(--spacing-lg)",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border)"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          
          <Input
            label="Contact Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          
          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: loading ? "var(--muted)" : "var(--primary)",
              color: "white",
              border: "none",
              padding: "var(--spacing-md) var(--spacing-xl)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-body)",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              minHeight: "var(--touch-target)",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 4px 12px rgba(255, 107, 53, 0.25)"
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        </div>
      )}

      {activeTab === 'menu' && (
        <div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "var(--spacing-lg)",
            padding: "var(--spacing-md) 0"
          }}>
            <h2 style={{ 
              fontSize: "var(--text-h2)", 
              fontWeight: "600", 
              color: "var(--text-primary)",
              margin: "0"
            }}>Menu Items</h2>
            <button 
              onClick={() => setShowAddMenu(true)}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-caption)",
                fontWeight: "600",
                cursor: "pointer",
                minHeight: "var(--touch-target)",
                transition: "all 0.2s ease"
              }}
            >
              Add Menu Item
            </button>
          </div>

          {showAddMenu && (
            <form onSubmit={handleAddMenuItem} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
              <h3>Add New Menu Item</h3>
              <Input
                label="Name"
                value={menuForm.name}
                onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                required
              />
              <Input
                label="Description"
                value={menuForm.description}
                onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
              />
              <Input
                label="Price"
                type="number"
                value={menuForm.price}
                onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                required
              />
              <Input
                label="Photo URL"
                value={menuForm.photoUrl}
                onChange={(e) => setMenuForm({...menuForm, photoUrl: e.target.value})}
              />
              <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
                <button 
                  type="submit"
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-caption)",
                    fontWeight: "600",
                    cursor: "pointer",
                    minHeight: "var(--touch-target)",
                    flex: "1"
                  }}
                >
                  Add Item
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddMenu(false)}
                  style={{
                    background: "var(--surface-card)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-caption)",
                    fontWeight: "500",
                    cursor: "pointer",
                    minHeight: "var(--touch-target)",
                    flex: "1"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {menuItems.map((item) => (
              <div key={item._id} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p><strong>${item.price}</strong></p>
                </div>
                <button 
                  onClick={() => handleDeleteMenuItem(item._id)}
                  style={{
                    background: "var(--error)",
                    color: "white",
                    border: "none",
                    padding: "var(--spacing-xs) var(--spacing-sm)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-small)",
                    fontWeight: "500",
                    cursor: "pointer",
                    minHeight: "32px"
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'orders' || activeTab === 'completed') && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Orders</h2>
            {activeTab !== 'completed' && (
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem" }}>
                <option value="">All Active Orders</option>
                <option value="PLACED">Placed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                {activeTab === 'completed' ? 'No completed orders yet' : 'No active orders'}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div>
                      <h4>Order #{order._id.slice(-6)}</h4>
                      <p>Status: <strong>{order.status}</strong></p>
                      <p>Items: {order.items?.length || 0}</p>
                      {activeTab === 'completed' && (
                        <p style={{ fontSize: '12px', color: '#666' }}>
                          Completed: {order.timeline?.find(t => t.status === 'COMPLETED')?.at ? 
                            new Date(order.timeline.find(t => t.status === 'COMPLETED').at).toLocaleString() : 
                            'Recently'
                          }
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {activeTab === 'completed' ? (
                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Completed</span>
                      ) : (
                        <>
                          {order.status === 'PLACED' && (
                            <Button onClick={() => handleStatusUpdate(order._id, 'ACCEPTED')}>Accept</Button>
                          )}
                          {order.status === 'ACCEPTED' && (
                            <Button onClick={() => handleStatusUpdate(order._id, 'PREPARING')}>Start Preparing</Button>
                          )}
                          {order.status === 'PREPARING' && (
                            <Button onClick={() => handleStatusUpdate(order._id, 'READY')}>Mark Ready</Button>
                          )}
                          {order.status === 'READY' && (
                            <Button onClick={() => handleStatusUpdate(order._id, 'COMPLETED')}>Complete</Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {activeTab === 'completed' && order.items && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f9fafb', borderRadius: '4px' }}>
                      <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '14px' }}>Order Items:</h5>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '12px', color: '#666' }}>
                          {item.name} x {item.qty} - ${(item.unitPrice * item.qty).toFixed(2)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'followers' && (
        <div>
          <h2>Followers</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {followers.length === 0 ? (
              <div style={{ 
                padding: "var(--spacing-xxl)", 
                textAlign: "center", 
                color: "var(--text-secondary)"
              }}>
                <div style={{
                  fontSize: "3rem",
                  marginBottom: "var(--spacing-md)",
                  opacity: "0.3"
                }}>👥</div>
                <h3 style={{
                  fontSize: "var(--text-h3)",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-sm)"
                }}>No followers yet</h3>
                <p style={{ fontSize: "var(--text-body)", margin: "0" }}>Share great content to attract followers!</p>
              </div>
            ) : (
              followers.map((follower) => (
                <div key={follower._id} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px", display: "flex", alignItems: "center" }}>
                  <div>
                    <h4>{follower.user.fullName}</h4>
                    <p style={{ fontSize: "12px", color: "#666" }}>Following since {new Date(follower.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;