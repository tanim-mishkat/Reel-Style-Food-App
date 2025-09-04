import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../app/theme.css";

const FoodPartnerRegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Join as Food Partner</h1>
          <p className="auth-subtitle">
            Create your partner account to get started
          </p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-divider">
            <span className="divider-text">or</span>
          </div>

          <div className="auth-links">
            <p className="auth-link-text">
              Want to register as user?{" "}
              <Link to="/user/register" className="auth-link">
                User Registration
              </Link>
            </p>
            <p className="auth-link-text">
              Already have an account?{" "}
              <Link to="/food-partner/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegisterForm;
