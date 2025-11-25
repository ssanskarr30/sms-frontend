import "../../styles/dashboard.css";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetingForm() {
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");

  useEffect(() => {
    // load assigned mentor from users list
    const all = JSON.parse(localStorage.getItem("users") || "[]");
    const student = all.find((u) => u.email === user.email);

    if (student) {
      setMentorName(student.mentorName || "Not Assigned");
      setMentorEmail(student.mentorEmail || null);
    }
  }, [user.email]);

  const submitMeeting = () => {
    if (note.trim() === "") {
      alert("Please enter meeting details.");
      return;
    }
    if (!mentorEmail) {
      alert("No mentor assigned.");
      return;
    }

    const now = new Date();

    const entry = {
      id: Date.now(),
      studentEmail: user.email,
      studentName: user.name,
      mentorEmail: mentorEmail,
      mentorName: mentorName,
      month: now.getMonth(),
      year: now.getFullYear(),
      date: now.toISOString(),
      note: note.trim(),
      status: "pending",
    };

    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    // Remove older log for same month
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

        {/* NEW — SHOW MENTOR NAME */}
        <div className="input-row">
          <label className="form-label">Your Mentor</label>
          <input
            className="form-input"
            value={mentorName || "Not Assigned"}
            disabled
          />
        </div>

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
