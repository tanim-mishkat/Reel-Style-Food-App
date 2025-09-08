import React, { useState, useEffect } from "react";
import {
  foodPartnerService,
  menuService,
  orderService,
  followService,
} from "../../../shared/services/api";
import Input from "../../../shared/components/ui/Input/Input";
import Button from "../../../shared/components/ui/Button/Button";
import styles from "./DashboardPage.module.css";
import { foodService } from "../../../shared/services/api";
import savedStyles from "../../home/pages/SavedPage.module.css";

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    prepTime: "",
    photoUrl: "",
  });
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [followers, setFollowers] = useState([]);
  const [reels, setReels] = useState([]);
  const [reelsLoading, setReelsLoading] = useState(true);
  const [editingReel, setEditingReel] = useState(null);
  const [deletingReel, setDeletingReel] = useState(null);
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [detailIndex, setDetailIndex] = useState(-1);
  const [reelSavingId, setReelSavingId] = useState(null);
  const [reelDeletingId, setReelDeletingId] = useState(null);
  const [menuSavingId, setMenuSavingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await foodPartnerService.getMyProfile();
        // backend returns { message, foodPartner }
        const data = response.data?.foodPartner || response.data;
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
        // fetch reels (food items represent reels)
        try {
          setReelsLoading(true);
          const r = await foodService.getFoodItems();
          setReels(r.data.foodItems || r.data || []);
        } catch (err) {
          // silent
        } finally {
          setReelsLoading(false);
        }
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
      setMenuForm({
        name: "",
        description: "",
        price: "",
        prepTime: "",
        photoUrl: "",
      });
      setShowAddMenu(false);
      setSuccess("Menu item added successfully");
    } catch (err) {
      setError("Failed to add menu item");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item._id !== id));
      setSuccess("Menu item deleted successfully");
    } catch (err) {
      setError(err?.message || "Failed to delete menu item");
    }
  };

  const openEditMenuItem = (item) => setEditingMenuItem({ ...item });

  const saveEditMenuItem = async (item) => {
    try {
      setMenuSavingId(item._id);
      const payload = {
        name: item.name,
        description: item.description,
        price: item.price,
        prepTime: item.prepTime,
        photoUrl: item.photoUrl,
      };
      const response = await menuService.updateMenuItem(item._id, payload);
      setMenuItems((prev) =>
        prev.map((m) =>
          m._id === item._id ? response.data.menuItem || response.data : m
        )
      );
      setEditingMenuItem(null);
      setMenuSavingId(null);
      setSuccess("Menu item updated");
    } catch (err) {
      setMenuSavingId(null);
      setError(err?.message || "Failed to update menu item");
    }
  };

  // Reel actions
  const openEditReel = (reel) => {
    setOpenMenuFor(null);
    setEditingReel({ ...reel });
  };

  const saveEditReel = async (reel) => {
    try {
      // optimistic update
      setReelSavingId(reel._id);
      setReels((prev) => prev.map((r) => (r._id === reel._id ? reel : r)));
      setEditingReel(null);
      // call API (assume update endpoint exists)
      // prepare metadata payload (backend expects JSON; prepTime/tags parsed server-side)
      const payload = {
        name: reel.name,
        description: reel.description,
      };
      if (reel.price !== undefined) payload.price = reel.price;
      if (reel.prepTime !== undefined)
        payload.prepTime =
          typeof reel.prepTime === "string"
            ? reel.prepTime
            : JSON.stringify(reel.prepTime);
      if (reel.tags !== undefined)
        payload.tags =
          typeof reel.tags === "string" ? reel.tags : JSON.stringify(reel.tags);

      const resp = await foodService.updateFood(reel._id, payload);
      setSuccess(resp?.data?.message || "Reel updated");
      setReelSavingId(null);
    } catch (err) {
      console.error("saveEditReel error", err);
      setReelSavingId(null);
      setError(err?.message || "Failed to save reel");
    }
  };

  const confirmDeleteReel = (reel) => setDeletingReel(reel);

  const openReelMenu = (reelId, e) => {
    e.stopPropagation();
    setOpenMenuFor(reelId === openMenuFor ? null : reelId);
  };

  const handleEditFromMenu = (reel) => {
    setOpenMenuFor(null);
    openEditReel(reel);
  };

  const handleDeleteFromMenu = (reel) => {
    setOpenMenuFor(null);
    confirmDeleteReel(reel);
  };

  const deleteReel = async (id) => {
    try {
      // optimistic remove
      setReelDeletingId(id);
      setReels((prev) => prev.filter((r) => r._id !== id));
      setDeletingReel(null);
      // call API (assume delete endpoint exists)
      const resp = await foodService.deleteFood(id);
      setSuccess(resp?.data?.message || "Reel deleted");
      setReelDeletingId(null);
    } catch (err) {
      console.error("deleteReel error", err);
      setReelDeletingId(null);
      setError(err?.message || "Failed to delete reel");
    }
  };

  const openDetail = (index) => setDetailIndex(index);
  const closeDetail = () => setDetailIndex(-1);
  const goDetailNext = () =>
    setDetailIndex((i) => Math.min(reels.length - 1, i + 1));
  const goDetailPrev = () => setDetailIndex((i) => Math.max(0, i - 1));

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      const ordersResponse = await orderService.getPartnerOrders();
      setOrders(ordersResponse.data.orders);

      const statusMessages = {
        ACCEPTED: "Order accepted - Customer notified",
        PREPARING: "Order marked as preparing",
        READY: "Order ready for pickup/delivery",
        COMPLETED: "Order completed successfully",
      };

      // Trigger toast notification
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail:
            statusMessages[newStatus] || `Order status updated to ${newStatus}`,
        })
      );

      // Trigger notification bell for partner
      window.dispatchEvent(
        new CustomEvent("triggerBell", {
          detail:
            statusMessages[newStatus] || `Order status updated to ${newStatus}`,
        })
      );

      setSuccess(
        statusMessages[newStatus] || `Order status updated to ${newStatus}`
      );
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const activeOrders = orders.filter((order) => order.status !== "COMPLETED");
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  );
  console.log(
    "All orders:",
    orders.length,
    "Active:",
    activeOrders.length,
    "Completed:",
    completedOrders.length
  );
  const filteredOrders =
    activeTab === "completed"
      ? completedOrders
      : statusFilter
      ? activeOrders.filter((order) => order.status === statusFilter)
      : activeOrders;
  console.log(
    "Active tab:",
    activeTab,
    "Filtered orders:",
    filteredOrders.length
  );

  if (!profile) return <div>Loading...</div>;

  // primary tabs to show as buttons (max 3), rest go into More dropdown
  const allTabs = [
    { key: "orders", label: "Orders" },
    { key: "menu", label: "Menu" },
    { key: "reels", label: "Reels" },
    { key: "completed", label: "History" },
    { key: "profile", label: "Profile" },
    { key: "followers", label: `Followers (${followers.length})` },
  ];
  const primaryTabs = allTabs.slice(0, 3);
  const moreTabs = allTabs.slice(3);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "16px",
        overflowX: "hidden",
        minHeight: "100vh",
        background: "var(--surface-light)",
        position: "relative",
      }}
    >
      {/* Compact header with back arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 0",
          borderBottom: "1px solid var(--border)",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 20,
            padding: 8,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Dashboard</h2>
      </div>

      {/* Tab buttons (mobile friendly) */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        {primaryTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1,
              padding: "10px 12px",
              background:
                activeTab === t.key ? "var(--primary)" : "var(--surface-card)",
              color: activeTab === t.key ? "white" : "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              minHeight: 44,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}

        {/* More dropdown for extra tabs */}
        {moreTabs.length > 0 && (
          <div style={{ position: "relative" }}>
            <details style={{ position: "relative" }} id="more-panel">
              <summary
                onClick={(e) => {
                  // toggle open programmatically on click (prevents summary default caret behavior)
                  const d = e.target.closest("details");
                  if (d) d.open = !d.open;
                  e.preventDefault();
                }}
                style={{
                  listStyle: "none",
                  cursor: "pointer",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface-card)",
                  minWidth: 44,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* 3-dot icon */}
                <svg
                  width="18"
                  height="6"
                  viewBox="0 0 18 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="3" cy="3" r="2" fill="currentColor" />
                  <circle cx="9" cy="3" r="2" fill="currentColor" />
                  <circle cx="15" cy="3" r="2" fill="currentColor" />
                </svg>
              </summary>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  zIndex: 20,
                  marginTop: 8,
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                {moreTabs.map((mt) => (
                  <div
                    key={mt.key}
                    onClick={() => {
                      setActiveTab(mt.key);
                      // close details
                      const det = document.getElementById("more-panel");
                      if (det) det.open = false;
                      document.activeElement.blur();
                    }}
                    style={{
                      padding: 12,
                      minWidth: 140,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mt.label}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* PROFILE */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingBottom: 88,
          }}
        >
          <section
            style={{
              background: "var(--surface-card)",
              padding: 12,
              borderRadius: 12,
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 700 }}>
              Personal Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            </div>
          </section>

          <section
            style={{
              background: "var(--surface-card)",
              padding: 12,
              borderRadius: 12,
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 700 }}>
              Contact Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            </div>
          </section>

          {/* sticky Save Changes button placeholder spacing */}
        </form>
      )}

      {/* MENU */}
      {activeTab === "menu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              Menu Items
            </h3>
            <button
              onClick={() => setShowAddMenu(true)}
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "10px 12px",
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Add
            </button>
          </div>

          {showAddMenu && (
            <form
              onSubmit={handleAddMenuItem}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 12,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--surface-card)",
              }}
            >
              <Input
                label="Name"
                value={menuForm.name}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, name: e.target.value })
                }
                required
              />
              <Input
                label="Description"
                value={menuForm.description}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, description: e.target.value })
                }
              />
              <Input
                label="Price"
                type="number"
                value={menuForm.price}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, price: e.target.value })
                }
                required
              />
              <Input
                label="Photo URL"
                value={menuForm.photoUrl}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, photoUrl: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "var(--primary)",
                    color: "white",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    fontWeight: 700,
                  }}
                >
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMenu(false)}
                  style={{
                    flex: 1,
                    background: "var(--surface-card)",
                    border: "1px solid var(--border)",
                    padding: "10px 12px",
                    borderRadius: 10,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {menuItems.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 15 }}>{item.name}</h4>
                  <p style={{ margin: 0, color: "#666" }}>{item.description}</p>
                  <p style={{ margin: 0, fontWeight: 700 }}>${item.price}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => openEditMenuItem(item)}
                    disabled={menuSavingId === item._id}
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      border: "none",
                      padding: "8px 10px",
                      borderRadius: 8,
                      opacity: menuSavingId === item._id ? 0.6 : 1,
                    }}
                  >
                    {menuSavingId === item._id ? "Saving..." : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDeleteMenuItem(item._id)}
                    disabled={menuSavingId === item._id}
                    style={{
                      background: "var(--error)",
                      color: "white",
                      border: "none",
                      padding: "8px 10px",
                      borderRadius: 8,
                      opacity: menuSavingId === item._id ? 0.6 : 1,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {editingMenuItem && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setEditingMenuItem(null)}
        >
          <div
            className={styles.bottomSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Edit Menu Item</h3>
            <Input
              label="Name"
              value={editingMenuItem.name}
              onChange={(e) =>
                setEditingMenuItem((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Input
              label="Description"
              value={editingMenuItem.description}
              onChange={(e) =>
                setEditingMenuItem((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <Input
              label="Price"
              type="number"
              value={editingMenuItem.price}
              onChange={(e) =>
                setEditingMenuItem((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setEditingMenuItem(null)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => saveEditMenuItem(editingMenuItem)}
                style={{ flex: 1, padding: 10, borderRadius: 8 }}
                className={`${styles.btnPrimary}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REELS */}
      {activeTab === "orders" ||
      activeTab === "menu" ||
      activeTab === "profile" ||
      activeTab === "followers"
        ? null
        : null}
      {activeTab === "reels" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Reels</h3>
          </div>

          {reelsLoading ? (
            <div className={styles.reelsGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeleton}></div>
              ))}
            </div>
          ) : reels.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No reels yet</h3>
              <p>Upload your first reel to engage your audience.</p>
              <button
                onClick={() => {}}
                className={`${styles.stickyBtn} ${styles.btnPrimary}`}
                style={{ marginTop: 12 }}
              >
                Upload your first reel
              </button>
            </div>
          ) : (
            // Use saved-videos style: show video elements in grid; clicking opens detail viewer like SavedPage
            <div className={styles.reelsGrid}>
              {reels.map((r, idx) => (
                <div key={r._id} className={savedStyles.savedVideoItem}>
                  <button
                    className={styles.reelMenuBtn}
                    onClick={(e) => openReelMenu(r._id, e)}
                    aria-label="more"
                  >
                    ⋮
                  </button>
                  {/* contextual menu for the card */}
                  {openMenuFor === r._id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 36,
                        background: "white",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        zIndex: 40,
                        overflow: "hidden",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        onClick={() => handleEditFromMenu(r)}
                        style={{ padding: 10, cursor: "pointer" }}
                      >
                        Edit
                      </div>
                      <div
                        onClick={() => handleDeleteFromMenu(r)}
                        style={{
                          padding: 10,
                          cursor: "pointer",
                          color: "var(--error)",
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                  <video
                    src={r.video}
                    className={savedStyles.savedVideo}
                    muted
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                    onClick={() => openDetail(idx)}
                  />
                  <div className={savedStyles.savedVideoInfo}>
                    <h3>{r.name}</h3>
                    <p>{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(activeTab === "orders" || activeTab === "completed") && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2>Orders</h2>
            {activeTab !== "completed" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "0.5rem" }}
              >
                <option value="">All Active Orders</option>
                <option value="PLACED">Placed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredOrders.length === 0 ? (
              <div
                style={{ padding: "2rem", textAlign: "center", color: "#666" }}
              >
                {activeTab === "completed"
                  ? "No completed orders yet"
                  : "No active orders"}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <h4>Order #{order._id.slice(-6)}</h4>
                      <p>
                        Status: <strong>{order.status}</strong>
                      </p>
                      <p>Items: {order.items?.length || 0}</p>
                      {activeTab === "completed" && (
                        <p style={{ fontSize: "12px", color: "#666" }}>
                          Completed:{" "}
                          {order.timeline?.find((t) => t.status === "COMPLETED")
                            ?.at
                            ? new Date(
                                order.timeline.find(
                                  (t) => t.status === "COMPLETED"
                                ).at
                              ).toLocaleString()
                            : "Recently"}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {activeTab === "completed" ? (
                        <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                          ✅ Completed
                        </span>
                      ) : (
                        <>
                          {order.status === "PLACED" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(order._id, "ACCEPTED")
                              }
                            >
                              Accept
                            </Button>
                          )}
                          {order.status === "ACCEPTED" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(order._id, "PREPARING")
                              }
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === "PREPARING" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(order._id, "READY")
                              }
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === "READY" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(order._id, "COMPLETED")
                              }
                            >
                              Complete
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {activeTab === "completed" && order.items && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem",
                        background: "#f9fafb",
                        borderRadius: "4px",
                      }}
                    >
                      <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "14px" }}>
                        Order Items:
                      </h5>
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{ fontSize: "12px", color: "#666" }}
                        >
                          {item.name} x {item.qty} - $
                          {(item.unitPrice * item.qty).toFixed(2)}
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

      {activeTab === "followers" && (
        <div>
          <h2>Followers</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {followers.length === 0 ? (
              <div
                style={{
                  padding: "var(--spacing-xxl)",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "var(--spacing-md)",
                    opacity: "0.3",
                  }}
                >
                  👥
                </div>
                <h3
                  style={{
                    fontSize: "var(--text-h3)",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  No followers yet
                </h3>
                <p style={{ fontSize: "var(--text-body)", margin: "0" }}>
                  Share great content to attract followers!
                </p>
              </div>
            ) : (
              followers.map((follower) => (
                <div
                  key={follower._id}
                  style={{
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4>{follower.user.fullName}</h4>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Following since{" "}
                      {new Date(follower.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Sticky primary action at bottom */}
      {/* Edit Reel Bottom Sheet */}
      {editingReel && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setEditingReel(null)}
        >
          <div
            className={styles.bottomSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Edit Post</h3>
            <Input
              label="Post name"
              value={editingReel.name}
              onChange={(e) =>
                setEditingReel((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              label="Description"
              value={editingReel.description}
              onChange={(e) =>
                setEditingReel((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setEditingReel(null)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => saveEditReel(editingReel)}
                style={{ flex: 1, padding: 10, borderRadius: 8 }}
                className={`${styles.btnPrimary}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deletingReel && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setDeletingReel(null)}
        >
          <div
            className={styles.centerModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post?</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setDeletingReel(null)}
                style={{ flex: 1, padding: 10, borderRadius: 8 }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteReel(deletingReel._id)}
                style={{ flex: 1, padding: 10, borderRadius: 8 }}
                className={`${styles.btnDanger}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail view */}
      {detailIndex >= 0 && reels[detailIndex] && (
        <div className={styles.detailView} onClick={closeDetail}>
          <video
            src={reels[detailIndex].video}
            className={styles.detailVideo}
            autoPlay
            controls
          />
          <div
            className={styles.detailInfo}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.detailTitle}>{reels[detailIndex].name}</div>
            <div className={styles.detailDesc}>
              {reels[detailIndex].description}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditReel(reels[detailIndex]);
                }}
                style={{ padding: "8px 10px", borderRadius: 8 }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDeleteReel(reels[detailIndex]);
                }}
                style={{ padding: "8px 10px", borderRadius: 8 }}
                className={`${styles.btnDanger}`}
              >
                Delete
              </button>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goDetailPrev();
                  }}
                  style={{ padding: "8px 10px", borderRadius: 8 }}
                >
                  Prev
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goDetailNext();
                  }}
                  style={{ padding: "8px 10px", borderRadius: 8 }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.98))",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "94%",
            maxWidth: 800,
            background: loading ? "var(--muted)" : "var(--primary)",
            color: "white",
            border: "none",
            padding: "14px 18px",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 800,
            boxShadow: loading ? "none" : "0 6px 18px rgba(255,107,53,0.18)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
