import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetingForm() {
  const { user } = useContext(AuthContext);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const storageKey = "meetingLogs"; // holds all student-submitted logs (pending/approved/rejected)

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  useEffect(() => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // find existing log for this student in the current month/year
    const found = all.find((r) => {
      if (r.studentEmail !== user.email) return false;
      const d = new Date(r.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    if (found) {
      setExisting(found);
      setTopic(found.topic || "");
      setNotes(found.notes || "");
      setDate(found.date || "");
    } else {
      setExisting(null);
      setTopic("");
      setNotes("");
      setDate("");
    }
  }, [user]);

  const handleSave = () => {
    if (!topic.trim() || !date) {
      alert("Please provide a topic and meeting date.");
      return;
    }
    if (!user) return alert("User not loaded");

    setSaving(true);

    // load users to find mentor for this student (if any)
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const studentObj = allUsers.find((u) => u.email === user.email);
    const mentorName = studentObj?.mentor || "";
    const mentorObj = allUsers.find((u) => u.name === mentorName && u.role === "faculty");
    const mentorEmail = mentorObj?.email || "";

    const allLogs = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const newLog = {
      id: existing ? existing.id : Date.now(),
      studentEmail: user.email,
      studentName: user.name,
      mentorEmail,   // may be empty (HOD/admin can assign later)
      mentorName: mentorName || "",
      topic: topic.trim(),
      notes: notes.trim(),
      date,
      status: existing ? existing.status : "pending", // pending / approved / rejected
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updated;
    if (existing) {
      // replace existing
      updated = allLogs.map((r) => (r.id === newLog.id ? newLog : r));
    } else {
      updated = [newLog, ...allLogs];
    }

    localStorage.setItem(storageKey, JSON.stringify(updated));
    setExisting(newLog);
    setSaving(false);

    if (newLog.status === "pending") {
      alert(existing ? "Meeting log updated. Waiting for mentor approval." : "Meeting logged. Waiting for mentor approval.");
    } else {
      alert("Meeting saved.");
    }
  };

  const handleCancel = () => {
    if (!existing) return;
    if (!window.confirm("Delete your pending log for this month?")) return;

    const allLogs = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const remaining = allLogs.filter((r) => r.id !== existing.id);
    localStorage.setItem(storageKey, JSON.stringify(remaining));
    setExisting(null);
    setTopic("");
    setNotes("");
    setDate("");
    alert("Pending meeting log deleted.");
  };

  const showInfo = () => {
    if (!existing) return null;

    return (
      <div style={{ marginTop: 12, color: "#444", fontSize: 13 }}>
        <div>Log status: <strong>{existing.status}</strong></div>
        <div>Submitted: {new Date(existing.createdAt).toLocaleString()}</div>
        {existing.status === "rejected" && <div style={{ color: "#b00" }}>Mentor rejected this log.</div>}
        {existing.status === "approved" && <div style={{ color: "#0a0" }}>Mentor approved this meeting.</div>}
      </div>
    );
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Log Monthly Meeting</h1>

      <div className="card-container">
        <h3>{existing ? "Your log for this month" : "Create meeting log"}</h3>

        <div className="input-row">
          <label className="form-label">Topic</label>
          <input className="form-input" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>

        <div className="input-row">
          <label className="form-label">Meeting Date</label>
          <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="input-row">
          <label className="form-label">Notes / Summary</label>
          <textarea className="form-input" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          {/* if approved already, show view link to meetings page */}
          {existing && existing.status === "approved" ? (
            <a className="card-btn" href="/student/meetings">View Approved Meeting</a>
          ) : (
            <>
              <button className="submit-btn" onClick={handleSave} disabled={saving}>
                {existing ? "Update Log" : "Submit Log"}
              </button>
              {existing && existing.status === "pending" && (
                <button className="btn-delete" onClick={handleCancel}>Cancel Log</button>
              )}
            </>
          )}
        </div>

        {showInfo()}
      </div>
    </div>
  );
}
