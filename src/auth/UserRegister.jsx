import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth-shared.css';

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user/register`,
        {
          fullName: `${firstName} ${lastName}`,
          email,
          password
        },
        { withCredentials: true }
      );

      navigate("/user/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page-wrapper">

      <div className="auth-card">

        <header>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Join and explore delicious meals 🍽️
          </p>
        </header>

        <div className="auth-switch">
          <span>Switch:</span>
          <Link to="/user/register">User</Link>
          <span>•</span>
          <Link to="/food-partner/register">Food Partner</Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="two-col">
            <input name="firstName" placeholder="First name" required />
            <input name="lastName" placeholder="Last name" required />
          </div>

          <input name="email" type="email" placeholder="Email address" required />

          <input name="password" type="password" placeholder="Password" required />

          <button type="submit" className="primary-btn">
            Create Account
          </button>

        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </p>

      </div>

    </div>
  );
};

export default UserRegister;