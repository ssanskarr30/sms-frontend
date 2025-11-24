import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetings() {
  const { user } = useContext(AuthContext);
  const [approved, setApproved] = useState([]);
  const [pendingThisMonth, setPendingThisMonth] = useState(null);

  useEffect(() => {
    if (!user) return;

    // approved meetings
    const savedApproved = JSON.parse(localStorage.getItem(`studentMeetings_${user.email}`) || "[]");
    setApproved(savedApproved);

    // check pending in meetingLogs for this month
    const allLogs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const pending = allLogs.find((r) => {
      if (r.studentEmail !== user.email) return false;
      const d = new Date(r.createdAt);
      return d.getMonth() === month && d.getFullYear() === year && r.status === "pending";
    });

    setPendingThisMonth(pending || null);
  }, [user]);

  const hasApprovedThisMonth = approved.some((m) => {
    const d = new Date(m.date || m.approvedAt || m.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="main-section">
      <h1 className="page-title">Monthly Mentor Meeting</h1>

      <div className="card-container">
        <h3>Status for this month</h3>

        {hasApprovedThisMonth ? (
          <div className="badge badge-green">✔ Meeting Completed (Approved)</div>
        ) : pendingThisMonth ? (
          <div>
            <div className="badge badge-orange">⏳ Log submitted — waiting for mentor approval</div>
            <div style={{ marginTop: 8 }}>
              <a className="card-btn" href="/student/meeting-request">Edit your log</a>
            </div>
          </div>
        ) : (
          <div className="badge badge-red">❗ No meeting logged yet</div>
        )}
      </div>

      <div className="card-container" style={{ marginTop: 20 }}>
        <h3>Meeting History</h3>
        {approved.length === 0 ? (
          <p>No approved meetings yet.</p>
        ) : (
          approved.map((m, i) => (
            <div key={i} className="smooth-row" style={{ padding: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{m.topic}</div>
              <div>{new Date(m.date).toLocaleDateString()} • Mentor: {m.mentor}</div>
              <div style={{ color: "#555", marginTop: 6 }}>{m.notes}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
