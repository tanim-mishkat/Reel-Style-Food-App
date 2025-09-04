import React, { useState } from "react";
import "../../styles/theme.css";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <h1>User Login</h1>
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
          Not a user?{" "}
          <Link to="/food-partner/login">
            <button>Food Partner Login</button>
          </Link>
        </p>
        <p>
          Don't have an account?{" "}
          <Link to="/user/register">
            <button>Register as User</button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
