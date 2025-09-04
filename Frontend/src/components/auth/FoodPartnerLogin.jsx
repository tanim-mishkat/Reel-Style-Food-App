import React, { useState } from "react";
import "../../styles/theme.css";
import { Link } from "react-router-dom";

const FoodPartnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <h1>Food Partner Login</h1>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="switch-role">
        <p>
          Not a food partner?{" "}
          <Link to="/user/login">
            <button>User Login</button>
          </Link>
        </p>
        <p>
          Don't have an account?{" "}
          <Link to="/food-partner/register">
            <button>Register as Food Partner</button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;