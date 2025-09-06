import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../AuthLayout/AuthLayout";
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
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
        Don't have an account?{" "}
        <Link to={ROUTES.USER_REGISTER} style={{ color: "var(--primary)" }}>
          Sign Up
        </Link>
      </p>
    </div>
  );

  return (
    <AuthLayout
      title="User Sign In"
      subtitle="Login to access your dashboard"
      footer={footer}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {error && <p style={{ color: "var(--destructive)", fontSize: "0.875rem" }}>{error}</p>}
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default UserLoginForm;