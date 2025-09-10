import { useState, useEffect } from "react";
import Input from "../../../../shared/components/ui/Input/Input";
import Button from "../../../../shared/components/ui/Button/Button";
import { foodPartnerService } from "../../../../shared/services/api";
import styles from "./ProfileTab.module.css";

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await foodPartnerService.getMyProfile();
      const profileData = response.data.foodPartner;
      setProfile(profileData);
      setFullName(profileData.fullName || "");
      setContactName(profileData.contactName || "");
      setPhone(profileData.phone || "");
      setAddress(profileData.address || "");
    } catch (err) {
      setError("Failed to load profile");
    }
  };

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
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileTab}>
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Restaurant Information</h3>

        {error && <div className={styles.errorText}>{error}</div>}
        {success && <div className={styles.successText}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGrid}>
            <Input
              label="Restaurant Name"
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
              type="tel"
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

          <Button
            type="submit"
            disabled={loading}
            className={styles.saveButton}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
