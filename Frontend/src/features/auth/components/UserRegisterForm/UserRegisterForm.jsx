import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../AuthLayout/AuthLayout";
import styles from "../AuthForm.module.css";
import Input from "../../../../shared/components/ui/Input/Input";
import Button from "../../../../shared/components/ui/Button/Button";
import LoadingSpinner from "../../../../shared/components/ui/LoadingSpinner/LoadingSpinner";
import { ROUTES } from "../../../../routes/routeConfig";

const UserRegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName.trim() || !email.trim() || !password.trim()) {
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
      await axios.post(
        `${API_URL}/auth/user/register`,
        { fullName, email, password },
        { withCredentials: true }
      );
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <div className={styles.formFooter}>
        <p className={styles.smallNote}>
          Already have an account?{" "}
          <Link to={ROUTES.USER_LOGIN} className={styles.linkPrimary}>
            Sign In
          </Link>
        </p>
      </div>
      <div className={styles.formFooter}>
        <p className={styles.smallNote}>
          Want to join as a partner?{" "}
          <Link
            to={ROUTES.FOOD_PARTNER_REGISTER}
            className={styles.linkPrimary}
          >
            Become a Partner
          </Link>
        </p>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Join as User"
      subtitle="Create your account to get started"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.authWrapper}>
        {error && <p className={styles.errorText}>{error}</p>}
        <div className={styles.formCard}>
          <Input
            id="fullName"
            label="Full Name"
            placeholder="Enter your full name"
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

export default UserRegisterForm;
