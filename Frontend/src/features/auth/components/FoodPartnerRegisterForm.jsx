import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

const FoodPartnerRegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
        `${API_URL}/auth/foodpartner/register`,
        {
          fullName,
          email,
          password,
          contactName,
          phone,
          address,
        },
        {
          withCredentials: true,
        }
      );

      alert(res.data.message);
      setFullName("");
      setEmail("");
      setPassword("");
      setContactName("");
      setPhone("");
      setAddress("");
      navigate("/create-food");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <div className="auth-divider">
        <span className="divider-text">or</span>
      </div>
      <div className="auth-links flex flex-col gap-2 text-center">
        <p className="text-sm">
          Want to register as user?{" "}
          <Link to="/user/register" className="text-blue-500 hover:underline">
            User Registration
          </Link>
        </p>
        <p className="text-sm">
          Already have an account?{" "}
          <Link
            to="/food-partner/login"
            className="text-blue-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Join as Food Partner"
      subtitle="Create your partner account to get started"
      footer={footer}
    >
      <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
          <Input
            id="contactName"
            label="Contact Name"
            placeholder="Enter contact person name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          <Input
            id="phone"
            type="tel"
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            id="address"
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full py-3 text-lg mt-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default FoodPartnerRegisterForm;
