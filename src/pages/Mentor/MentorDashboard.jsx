import "../../styles/dashboard.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function MentorDashboard() {
  const { user, logout } = useContext(AuthContext);

  const [assignedCount, setAssignedCount] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // COUNT assigned students
    const assigned = users.filter(
      (u) => u.role === "student" && u.mentor === user.name
    );
    setAssignedCount(assigned.length);

    // COUNT pending meeting approvals
    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");
    const pending = logs.filter(
      (r) =>
        r.status === "pending" &&
        ((r.mentorEmail && r.mentorEmail === user.email) ||
          r.mentorName === user.name)
    );
    setPendingApprovals(pending.length);

    // UNREAD messages
    const newUnread =
      parseInt(localStorage.getItem(`mentorUnread_${user.email}`) || "0") || 0;
    setUnread(newUnread);
  }, [user]);

  return (
    <div className="dashboard-container">

      {/* ------------- SIDEBAR ------------- */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">👨‍🏫 Mentor Panel</div>
        </div>

        <a className="sidebar-link active" href="/mentor">📊 Dashboard</a>

        <a className="sidebar-link" href="/mentor/students">
          👥 Assigned Students
        </a>

        <a className="sidebar-link" href="/mentor/requests">
          📥 Approvals
          {pendingApprovals > 0 && (
            <span className="notif-badge">{pendingApprovals}</span>
          )}
        </a>

        <a className="sidebar-link" href="/mentor/messages">
          💬 Messages 
          {unread > 0 && (
            <span className="notif-badge">{unread}</span>
          )}
        </a>

        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </div>

      {/* ------------- MAIN SECTION ------------- */}
      <div className="main-section">

        {/* Top navbar */}
        <div className="top-navbar">
          <div className="top-navbar-left">
            <h2>Welcome, {user?.name}</h2>
          </div>

          <div className="top-navbar-right">
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <h1 className="page-title">Mentor Dashboard</h1>

        {/* CARDS */}
        <div className="card-grid">

          <div className="dashboard-card">
            <h2>👥 Assigned Students</h2>
            <p>You are mentoring {assignedCount} students.</p>
            <Link className="card-btn" to="/mentor/students">Open</Link>
          </div>

          <div
            className="dashboard-card"
            style={{
              borderTop:
                pendingApprovals > 0
                  ? "4px solid #ff4d4d"
                  : "4px solid #28a745",
            }}
          >
            <h2>📥 Pending Approvals</h2>
            <p>
              {pendingApprovals > 0
                ? `${pendingApprovals} logs need your approval.`
                : "No pending logs."}
            </p>
            <Link className="card-btn" to="/mentor/requests">Open</Link>
          </div>

          <div className="dashboard-card">
            <h2>
              💬 Messages{" "}
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </h2>
            <p>
              {unread > 0
                ? `${unread} unread message(s) from students`
                : "No unread messages"}
            </p>
            <Link className="card-btn" to="/mentor/messages">Open</Link>
          </div>

          <div className="dashboard-card">
            <h2>📝 Meeting History</h2>
            <p>Check previous meetings through student profiles.</p>
            <Link className="card-btn" to="/mentor/students">Open</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
