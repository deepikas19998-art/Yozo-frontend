import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/register`,
        {
          name: businessName,
          contactName,
          phone,
          email,
          password,
          address
        },
        { withCredentials: true }
      );

      navigate("/food-partner/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page-wrapper">

      <div className="auth-card">

        <header>
          <h1 className="auth-title">Partner Registration</h1>
          <p className="auth-subtitle">
            Start selling food and grow your business 🚀
          </p>
        </header>

        <div className="auth-switch">
          <span>Switch:</span>
          <Link to="/user/register">User</Link>
          <span>•</span>
          <Link to="/food-partner/register">Partner</Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <input name="businessName" placeholder="Business name" required />

          <input name="contactName" placeholder="Contact person name" required />

          <input name="phone" placeholder="Phone number" required />

          <input type="email" name="email" placeholder="Email address" required />

          <input type="password" name="password" placeholder="Password" required />

          <input name="address" placeholder="Full business address" required />

          <button type="submit" className="primary-btn">
            Create Partner Account
          </button>

        </form>

        <p className="auth-footer">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </p>

      </div>

    </div>
  );
};

export default FoodPartnerRegister;