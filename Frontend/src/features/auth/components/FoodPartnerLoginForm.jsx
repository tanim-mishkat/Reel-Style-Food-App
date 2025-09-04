import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../app/theme.css";

const FoodPartnerLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back, Partner</h1>
          <p className="auth-subtitle">Sign in to your food partner account</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-divider">
            <span className="divider-text">or</span>
          </div>

          <div className="auth-links">
            <p className="auth-link-text">
              Not a food partner?{" "}
              <Link to="/user/login" className="auth-link">
                User Login
              </Link>
            </p>
            <p className="auth-link-text">
              Don't have an account?{" "}
              <Link to="/food-partner/register" className="auth-link">
                Create Partner Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLoginForm;
