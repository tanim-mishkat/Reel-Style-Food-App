import React, { useState } from "react";
import "../../styles/theme.css";
import { Link } from "react-router-dom";

const UserRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="register-container">
      <h1>User Register</h1>
      <form>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>
      <div className="switch-role">
        <p>
          Already have an account?{" "}
          <Link to="/food-partner/register">
            <button>Register as Food Partner</button>
          </Link>
        </p>
        <p>
          Already registered?{" "}
          <Link to="/user/login">
            <button>Login as User</button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
