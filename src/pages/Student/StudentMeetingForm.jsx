import "../../styles/dashboard.css";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetingForm() {
  const { user } = useContext(AuthContext);

  const [note, setNote] = useState("");
  const [meetingDate, setMeetingDate] = useState("");

  const [mentorName, setMentorName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");

  // Load mentor information
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("users") || "[]");
    const me = all.find((u) => u.email === user.email);

    if (me) {
      setMentorName(me.mentorName || "Not Assigned");
      setMentorEmail(me.mentorEmail || null);
    }
  }, [user.email]);

  const submitMeeting = () => {
    if (!mentorEmail) {
      alert("No mentor assigned.");
      return;
    }
    if (meetingDate.trim() === "") {
      alert("Please select meeting date.");
      return;
    }
    if (note.trim() === "") {
      alert("Please enter meeting discussion details.");
      return;
    }

    const selectedDate = new Date(meetingDate);
    const entry = {
      id: Date.now(),
      studentEmail: user.email,
      studentName: user.name,
      mentorEmail: mentorEmail,
      mentorName: mentorName,
      date: meetingDate, // meeting completed date
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
      note: note.trim(),
      status: "pending",
    };

    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    // Remove old meeting for this month
    const filtered = logs.filter(
      (m) =>
        !(
          m.studentEmail === user.email &&
          m.month === entry.month &&
          m.year === entry.year
        )
    );

    localStorage.setItem(
      "meetingLogs",
      JSON.stringify([entry, ...filtered])
    );

    alert("Meeting log submitted to mentor for approval.");
    setNote("");
    setMeetingDate("");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Submit Monthly Meeting</h1>

      <div className="form-card">

        {/* Mentor Name */}
        <div className="input-row">
          <label className="form-label">Your Mentor</label>
          <input
            className="form-input"
            value={mentorName || "Not Assigned"}
            disabled
          />
        </div>

        {/* Meeting Date */}
        <div className="input-row">
          <label className="form-label">Meeting Date</label>
          <input
            type="date"
            className="form-input"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="input-row">
          <label className="form-label">What was discussed?</label>
          <textarea
            className="form-input"
            rows={4}
            placeholder="Write meeting discussion details..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <button className="submit-btn" onClick={submitMeeting}>
          Submit Meeting Log
        </button>
      </div>
    </div>
  );
}
