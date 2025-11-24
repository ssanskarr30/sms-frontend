import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");   // NEW
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = login(email, password, true);

      // ❗Check selected role matches account role
      if (user.role !== role) {
        setError(`This user is registered as ${user.role}, not ${role}. Please choose correct role.`);
        return;
      }

      // Redirect based on role
      if (role === "student") navigate("/student", { replace: true });
      else if (role === "faculty") navigate("/mentor", { replace: true });

      else if (role === "hod") navigate("/hod", { replace: true });
      else navigate("/admin", { replace: true });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Student Monitoring System</h1>
      <p className="login-subtitle">Sign in to continue</p>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* EMAIL */}
        <div className="input-box">
          <label className="input-label">Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <label className="input-label">Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* ROLE SELECTOR */}
        <div className="input-box">
          <label className="input-label">Sign in as</label>
          <select
            className="input-field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Mentor / Faculty</option>
            <option value="hod">HOD</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* REMEMBER ME */}
        <div className="options-row">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{" "}
            Remember Me
          </label>
          <Link className="forgot-link" to="/forgot">Forgot password?</Link>
        </div>

        <button className="login-btn" type="submit">
          Sign In
        </button>
      </form>

      <p className="sign-up-text">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
