import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../AuthLayout/AuthLayout";
import styles from "../AuthForm.module.css";
import Input from "../../../../shared/components/ui/Input/Input";
import Button from "../../../../shared/components/ui/Button/Button";
import { ROUTES } from "../../../../routes/routeConfig";

const UserLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/auth/user/login`,
        { email, password },
        { withCredentials: true }
      );
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <div className={styles.formFooter}>
        <p className={styles.smallNote}>
          Don’t have an account?{" "}
          <Link to={ROUTES.USER_REGISTER} className={styles.linkPrimary}>
            Sign Up
          </Link>
        </p>
      </div>
      <div className={styles.formFooter}>
        <p className={styles.smallNote}>
          Are you a food partner?{" "}
          <Link to={ROUTES.FOOD_PARTNER_LOGIN} className={styles.linkPrimary}>
            Partner Sign In
          </Link>
        </p>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="User Sign In"
      subtitle="Login to access your dashboard"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.authWrapper}>
        {error && <p className={styles.errorText}>{error}</p>}
        <div className={styles.formCard}>
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={styles.fullWidthBtn}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default UserLoginForm;
