import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth-card.css";

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">

        <header>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Choose how you want to join the platform
          </p>
        </header>

        <div className="role-container">

          <Link to="/user/register" className="role-card user">
            <div className="role-icon">👤</div>
            <div>
              <h3>User</h3>
              <p>Order food from restaurants</p>
            </div>
          </Link>

          <Link to="/food-partner/register" className="role-card partner">
            <div className="role-icon">👨‍🍳</div>
            <div>
              <h3>Food Partner</h3>
              <p>List your restaurant & grow business</p>
            </div>
          </Link>

        </div>

        <div className="auth-alt-action">
          Already have an account?{" "}
          <Link to="/user/login">Sign in</Link>
        </div>

      </div>
    </div>
  );
};

export default ChooseRegister;