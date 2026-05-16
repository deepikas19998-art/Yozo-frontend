import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/auth-shared.css";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`,
        { email, password },
        { withCredentials: true }
      );

      navigate("/create-food");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page-wrapper">

      <div className="auth-card">

        <header>
          <h1 className="auth-title">Partner Login</h1>
          <p className="auth-subtitle">
            Manage your restaurant & orders 🍽️
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>

          <input
            name="email"
            type="email"
            placeholder="Business email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit" className="primary-btn">
            Sign In
          </button>

        </form>

        <div className="auth-footer">
          New partner? <Link to="/food-partner/register">Create account</Link>
        </div>

      </div>

    </div>
  );
};

export default FoodPartnerLogin;