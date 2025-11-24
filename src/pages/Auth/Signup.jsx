import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/signup.css";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    try {
      signup(form);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create Your Account</h1>
      <p className="signup-subtitle">Fill the details to register</p>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSignup}>
        <div className="signup-input-box">
          <label className="signup-label">Full Name</label>
          <input
            name="name"
            placeholder="Enter name"
            className="signup-input"
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-input-box">
          <label className="signup-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            className="signup-input"
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-input-box">
          <label className="signup-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            className="signup-input"
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-input-box">
          <label className="signup-label">Role</label>
          <select
            name="role"
            className="signup-input"
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="hod">HOD</option>
            
          </select>
        </div>

        <button className="signup-button">Sign Up</button>
      </form>

      <p className="signup-bottom-text">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}
