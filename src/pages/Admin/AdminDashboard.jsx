import "../../styles/dashboard.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🛠 Admin Panel</div>
        </div>

        <a className="sidebar-link active" href="/admin">📊 Dashboard</a>
        <a className="sidebar-link" href="/admin/users">👥 Manage Users</a>
        <a className="sidebar-link" href="/admin/forms">📄 Form Builder</a>
      </div>

      {/* MAIN */}
      <div className="main-section">
        <div className="top-navbar">
          <div className="top-navbar-left">
            <h2>Welcome, {user?.name}</h2>
          </div>
          <div className="top-navbar-right">
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <h1 className="page-title">Admin Dashboard</h1>

        <div className="card-grid">
          <div className="dashboard-card">
            <h2>👥 Manage Users</h2>
            <p>Add, delete or modify users registered in the system.</p>
            <Link className="card-btn" to="/admin/users">Open</Link>
          </div>

          <div className="dashboard-card">
            <h2>📄 Form Builder</h2>
            <p>Create and manage forms that students can submit.</p>
            <Link className="card-btn" to="/admin/forms">Open</Link>
          </div>

          <div className="dashboard-card">
            <h2>✔ Final Approvals</h2>
            <p>View items that require your final sign-off.</p>
            <Link className="card-btn" to="/student/submissions">Open</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
