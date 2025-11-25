import "../../styles/dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);

  const [meetingPending, setMeetingPending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // ---------------------------------------------------------
  // 🔥 FIXED FUNCTION — Get assigned mentor EMAIL correctly
  // ---------------------------------------------------------
  const getAssignedMentorEmail = () => {
    const all = JSON.parse(localStorage.getItem("users") || "[]");
    const me = all.find((u) => u.email === user.email);
    return me?.mentorEmail || null;
  };

  // ---------------------------------------------------------
  // MAIN EFFECT
  // ---------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    // ---------- CHECK MEETING STATUS (NEW SYSTEM) ----------
    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    const approved = logs.filter(
      (m) => m.studentEmail === user.email && m.status === "approved"
    );

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const metThisMonth = approved.some((m) => {
      const d = new Date(m.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    setMeetingPending(!metThisMonth);

    // ---------- CHECK MESSAGE COUNT ----------
    const allMsgs = JSON.parse(localStorage.getItem("studentMessages") || "{}");

    const mentorEmail = getAssignedMentorEmail(); // fixed
    const threads = allMsgs[user.email] || {};

    if (mentorEmail && threads[mentorEmail]) {
      setMessageCount(threads[mentorEmail].length);
    } else {
      setMessageCount(0);
    }

  }, [user]);

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🎓 Student Panel</div>
        </div>

        <a className="sidebar-link" href="/student">📊 Dashboard</a>
        <a className="sidebar-link" href="/student/forms">📝 Available Forms</a>
        <a className="sidebar-link" href="/student/submissions">📁 My Submissions</a>
        <a className="sidebar-link" href="/student/marks">📚 Semester Marks</a>

        <a className="sidebar-link" href="/student/messages">
          💬 Messages 
          {messageCount > 0 && <span className="notif-badge">{messageCount}</span>}
        </a>

        <a className="sidebar-link" href="/student/meeting-request">📅 Meeting Form</a>
        <a className="sidebar-link" href="/student/meetings">📋 Meeting Status</a>

        <a className="sidebar-link" href="/student/profile">👤 Profile</a>

        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main Section */}
      <div className="main-section">
        <div className="top-navbar">
          <div className="top-navbar-left">
            <h2>Welcome, {user?.name}</h2>
          </div>

          <div className="top-navbar-right">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <h1 className="page-title">Student Dashboard</h1>

        <div className="card-grid">

          <div
            className="dashboard-card"
            style={{
              borderTop: meetingPending ? "4px solid #ff4d4d" : "4px solid #28a745",
            }}
          >
            <h2>📅 Monthly Mentor Meeting</h2>
            <p>
              {meetingPending
                ? "Your monthly mentor meeting is pending. Please complete it."
                : "Your mentor meeting for this month is approved!"}
            </p>
            <a href="/student/meetings" className="card-btn">View</a>
          </div>

          <div className="dashboard-card">
            <h2>📝 Available Forms</h2>
            <p>Fill all active academic forms assigned by faculty.</p>
            <a href="/student/forms" className="card-btn">Open</a>
          </div>

          <div className="dashboard-card">
            <h2>📁 My Submissions</h2>
            <p>Track your submitted forms and check approval status.</p>
            <a href="/student/submissions" className="card-btn">Open</a>
          </div>

          <div className="dashboard-card">
            <h2>📚 Semester Marks</h2>
            <p>Submit and track semester-wise exam results.</p>
            <a href="/student/marks" className="card-btn">Open</a>
          </div>

          <div className="dashboard-card">
            <h2>💬 Messages</h2>
            <p>View important updates sent by your mentor.</p>
            <a href="/student/messages" className="card-btn">Open</a>
          </div>

          <div className="dashboard-card">
            <h2>👤 Profile</h2>
            <p>Manage your personal and academic information.</p>
            <a href="/student/profile" className="card-btn">Open</a>
          </div>

        </div>
      </div>
    </div>
  );
}
