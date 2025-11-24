import "../../styles/dashboard.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function HodDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🏛 HOD Panel</div>
        </div>

        <a className="sidebar-link active" href="/hod">📊 Dashboard</a>
        <a className="sidebar-link" href="/hod/assign-mentor">👨‍🏫 Assign Mentors</a>
        <a className="sidebar-link" href="/student/submissions">📁 View Submissions</a>
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

        <h1 className="page-title">HOD Dashboard</h1>

        <div className="card-grid">
          <div className="dashboard-card">
            <h2>👨‍🏫 Assign Mentors</h2>
            <p>Assign or reassign mentors to students in your department.</p>
            <Link className="card-btn" to="/hod/assign-mentor">Open</Link>
          </div>

          <div className="dashboard-card">
            <h2>📁 Pending Approvals</h2>
            <p>Review student submissions requiring department approval.</p>
            <Link className="card-btn" to="/student/submissions">Open</Link>
          </div>

          <div className="dashboard-card">
            <h2>📅 Mentor Meetings</h2>
            <p>Overview of mentor meeting logs and monthly reports.</p>
            <Link className="card-btn" to="/mentor/meetings">Open</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
