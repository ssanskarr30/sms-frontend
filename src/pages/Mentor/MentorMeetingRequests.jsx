import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MentorMeetingApprovals() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    // Filter logs relevant to this mentor:
    // either mentorEmail matches or mentorName matches, or if mentorEmail empty we can check mentorName
    const filtered = all.filter((r) => {
      // show only pending logs
      if (r.status !== "pending") return false;
      if (r.mentorEmail) return r.mentorEmail === user.email;
      return r.mentorName === user.name;
    });

    setRequests(filtered);
  }, [user]);

  const saveGlobal = (updated) => {
    const global = JSON.parse(localStorage.getItem("meetingLogs") || "[]");
    const ids = updated.map((r) => r.id);
    const merged = [...global.filter((g) => !ids.includes(g.id)), ...updated];
    localStorage.setItem("meetingLogs", JSON.stringify(merged));
    setRequests(updated.filter((r) => r.status === "pending"));
  };

  const approve = (req) => {
    if (!window.confirm("Approve this student log? This will mark meeting completed for the student.")) return;

    // mark as approved in logs
    const updated = requests.map((r) => (r.id === req.id ? { ...r, status: "approved", updatedAt: new Date().toISOString() } : r));
    // write back
    saveGlobal(updated);

    // add to student's approved meetings storage
    const studentKey = `studentMeetings_${req.studentEmail}`;
    const prev = JSON.parse(localStorage.getItem(studentKey) || "[]");
    const record = {
      id: Date.now(),
      date: req.date,
      topic: req.topic,
      notes: req.notes,
      mentor: user.name,
      approvedAt: new Date().toISOString()
    };
    localStorage.setItem(studentKey, JSON.stringify([record, ...prev]));

    alert("Meeting approved and recorded for the student.");
  };

  const reject = (req) => {
    const note = prompt("Optional rejection note (visible to student):", "");
    const updated = requests.map((r) => (r.id === req.id ? { ...r, status: "rejected", updatedAt: new Date().toISOString(), rejectionNote: note || "" } : r));
    saveGlobal(updated);
    alert("Meeting log rejected.");
  };

  const refresh = () => {
    const all = JSON.parse(localStorage.getItem("meetingLogs") || "[]");
    const filtered = all.filter((r) => r.status === "pending" && ((r.mentorEmail && r.mentorEmail === user.email) || r.mentorName === user.name));
    setRequests(filtered);
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Meeting Approvals</h1>

      <div className="card-container">
        {requests.length === 0 ? (
          <div className="empty-row">No pending student logs to approve.</div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="smooth-row" style={{ padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.studentName} — {r.studentEmail}</div>
                  <div style={{ color: "#444" }}>{r.topic} • {new Date(r.date).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: "#666" }}>Status: <strong>{r.status}</strong></div>
                  <div style={{ fontSize: 12, color: "#888" }}>{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div><strong>Notes:</strong> {r.notes || "—"}</div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="card-btn" onClick={() => approve(r)}>Approve</button>
                <button className="btn-delete" onClick={() => reject(r)}>Reject</button>
                <button className="table-btn" onClick={refresh}>Refresh</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
