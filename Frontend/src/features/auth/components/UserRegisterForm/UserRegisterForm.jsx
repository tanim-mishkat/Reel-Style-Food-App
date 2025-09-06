import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../AuthLayout/AuthLayout";
import Input from "../../../../shared/components/ui/Input/Input";
import Button from "../../../../shared/components/ui/Button/Button";
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
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
        Already have an account?{" "}
        <Link to={ROUTES.USER_LOGIN} style={{ color: "var(--primary)" }}>
          Sign In
        </Link>
      </p>
    </div>
  );

  return (
    <AuthLayout
      title="Join as User"
      subtitle="Create your account to get started"
      footer={footer}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {error && <p style={{ color: "var(--destructive)", fontSize: "0.875rem" }}>{error}</p>}
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
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default UserRegisterForm;