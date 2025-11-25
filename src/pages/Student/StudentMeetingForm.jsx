import "../../styles/dashboard.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetingForm() {
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(""); // NEW DATE STATE

  const submitMeeting = () => {
    if (!date) {
      alert("Please select the meeting date.");
      return;
    }

    if (note.trim() === "") {
      alert("Please enter meeting details.");
      return;
    }

    const selectedDate = new Date(date);
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const entry = {
      id: Date.now(),
      studentEmail: user.email,
      studentName: user.name,

      mentorEmail: user.mentorEmail || user.mentor, // support both
      mentorName: user.mentorName || user.mentorName,

      date: selectedDate.toISOString(),

      month,
      year,
      note: note.trim(),
      status: "pending",
    };

    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    // Remove any old meeting request of same month
    const filtered = logs.filter(
      (l) =>
        !(
          l.studentEmail === user.email &&
          l.month === month &&
          l.year === year
        )
    );

    localStorage.setItem(
      "meetingLogs",
      JSON.stringify([entry, ...filtered])
    );

    alert("Meeting log submitted for approval.");
    setNote("");
    setDate("");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Submit Monthly Meeting</h1>

      <div className="form-card">

        {/* DATE FIELD */}
        <label className="form-label">Select Meeting Date</label>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* NOTE FIELD */}
        <label className="form-label" style={{ marginTop: "15px" }}>
          Describe what was discussed
        </label>
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
