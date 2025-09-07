import React, { useState, useEffect } from "react";
import { foodPartnerService, menuService } from "../../../shared/services/api";
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

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Dashboard</h1>
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ padding: "0.5rem 1rem", background: activeTab === 'profile' ? '#007bff' : '#f8f9fa', color: activeTab === 'profile' ? 'white' : 'black', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          style={{ padding: "0.5rem 1rem", background: activeTab === 'menu' ? '#007bff' : '#f8f9fa', color: activeTab === 'menu' ? 'white' : 'black', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          Menu Items
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      )}

      {activeTab === 'menu' && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Menu Items</h2>
            <Button onClick={() => setShowAddMenu(true)}>Add Menu Item</Button>
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
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button type="submit">Add Item</Button>
                <Button type="button" onClick={() => setShowAddMenu(false)}>Cancel</Button>
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
                <Button onClick={() => handleDeleteMenuItem(item._id)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;