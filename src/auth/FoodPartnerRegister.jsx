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
      const response = await axios.post(
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

      console.log(response.data);
      navigate("/food-partner/login"); // Redirect after successful registration

    } catch (error) {
      console.error("There was an error registering!", error.response?.data || error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-register-title">
        <header>
          <h1 id="partner-register-title" className="auth-title">Partner sign up</h1>
          <p className="auth-subtitle">Grow your business with our platform.</p>
        </header>
        <nav className="auth-alt-action" style={{marginTop: '-4px'}}>
          <strong style={{fontWeight:600}}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
        </nav>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Form fields added here */}
          <input type="text" name="businessName" placeholder="Business Name" required />
          <input type="text" name="contactName" placeholder="Contact Name" required />
          <input type="text" name="phone" placeholder="Phone" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="text" name="address" placeholder="Address" required />

          <button className="auth-submit" type="submit">Create Partner Account</button>
        </form>
        <div className="auth-alt-action">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
