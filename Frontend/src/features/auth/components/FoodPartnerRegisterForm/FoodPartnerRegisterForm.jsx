import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../AuthLayout/AuthLayout";
import styles from "../AuthForm.module.css";
import Input from "../../../../shared/components/ui/Input/Input";
import LoadingSpinner from "../../../../shared/components/ui/LoadingSpinner/LoadingSpinner";
import ImageUpload from "../../../../shared/components/ui/ImageUpload/ImageUpload";
import { ROUTES } from "../../../../routes/routeConfig";

const FoodPartnerRegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !contactName.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("contactName", contactName);
      formData.append("phone", phone);
      formData.append("address", address);

      if (profileImg) {
        formData.append("profileImg", profileImg);
      }

      const response = await axios.post(
        `${API_URL}/auth/foodpartner/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout
        }
      );
      navigate(ROUTES.CREATE_FOOD);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className={styles.formFooter}>
      <p className={styles.smallNote}>
        Already have an account?{" "}
        <Link to={ROUTES.FOOD_PARTNER_LOGIN} className={styles.linkPrimary}>
          Sign In
        </Link>
      </p>
    </div>
  );

  return (
    <AuthLayout
      title="Join as Food Partner"
      subtitle="Create your partner account to get started"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.authWrapper}>
        {error && <p className={styles.errorText}>{error}</p>}
        <div className={styles.formCard}>
          <Input
            id="fullName"
            label="Restaurant Name"
            placeholder="Enter your restaurant name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            id="contactName"
            label="Contact Name"
            placeholder="Enter contact person name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          <Input
            id="phone"
            type="tel"
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            id="address"
            label="Address"
            placeholder="Enter your restaurant address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <ImageUpload
            id="profileImg"
            label="Restaurant Logo (Optional)"
            value={profileImg}
            onChange={setProfileImg}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={styles.fullWidthBtn}
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" color="white" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default FoodPartnerRegisterForm;
