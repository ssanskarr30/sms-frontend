import "../../styles/dashboard.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetingForm() {
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState("");

  const submitMeeting = () => {
    if (note.trim() === "") {
      alert("Please enter meeting details.");
      return;
    }

    const now = new Date();

    const entry = {
      id: Date.now(),
      studentEmail: user.email,
      studentName: user.name,
      mentorEmail: user.mentor,
      month: now.getMonth(),
      year: now.getFullYear(),
      date: now.toISOString(),
      note: note.trim(),
      status: "pending",
    };

    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    // Remove old request for the same month
    const filtered = logs.filter(
      (l) =>
        !(
          l.studentEmail === user.email &&
          l.month === entry.month &&
          l.year === entry.year
        )
    );

    localStorage.setItem(
      "meetingLogs",
      JSON.stringify([entry, ...filtered])
    );

    alert("Meeting log submitted for approval.");
    setNote("");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Submit Monthly Meeting</h1>

      <div className="form-card">
        <label className="form-label">Describe what was discussed</label>
        <textarea
          className="form-input"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <button className="submit-btn" onClick={submitMeeting}>
          Submit Meeting Log
        </button>
      </div>
    </div>
  );
}
