import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

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
      alert(res.data.message);
      
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <div className="auth-divider">
        <span className="divider-text">or</span>
      </div>
      <div className="auth-links text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/user/register" className="text-blue-500 hover:underline">
            Sign Up
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
      <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
      </div>
    </AuthLayout>
  );
};

export default UserLoginForm;
