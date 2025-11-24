import "../../styles/dashboard.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    roll: "",
    role: "",
    password: "",
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        branch: user.branch || "",
        roll: user.roll || "",
        role: user.role,
        password: user.password, // IMPORTANT
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();

    // load users
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // find logged-in user by email + role (safe)
    const idx = users.findIndex(
      (u) => u.email === user.email && u.role === user.role
    );

    if (idx >= 0) {
      users[idx] = form; // update user
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("authUser", JSON.stringify(form));

    setUser(form);
    alert("Profile updated successfully!");
  };

  return (
    <div className="main-section">

      <h1 className="page-title">My Profile</h1>

      <div className="form-card">

        <div className="input-row">
          <label className="form-label">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="input-row">
          <label className="form-label">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="input-row">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="input-row">
          <label className="form-label">Branch</label>
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="input-row">
          <label className="form-label">Roll Number</label>
          <input
            name="roll"
            value={form.roll}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button className="submit-btn" onClick={handleSave}>
          Save Profile
        </button>

      </div>
    </div>
  );
}
