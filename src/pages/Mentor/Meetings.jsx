import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MentorMeetings() {
  const { user } = useContext(AuthContext);

  const [topic, setTopic] = useState("");
  const [student, setStudent] = useState("");
  const [date, setDate] = useState("");

  const [assignedStudents, setAssignedStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Students assigned to this mentor
    const assigned = allUsers.filter(
      (u) => u.role === "student" && u.mentor === user?.name
    );
    setAssignedStudents(assigned);

    // Mentor’s meeting logs
    const stored = JSON.parse(
      localStorage.getItem(`meetings_${user.email}`) || "[]"
    );
    setMeetings(stored);
  }, [user]);

  const handleAdd = () => {
    if (!topic || !student || !date) {
      alert("Please fill all fields.");
      return;
    }

    const newMeeting = {
      id: Date.now(),
      student,
      topic,
      date,
      mentor: user.name
    };

    // 1️⃣ Save in mentor's logs
    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    localStorage.setItem(`meetings_${user.email}`, JSON.stringify(updated));

    // 2️⃣ Save record under student logs (official meeting completion)
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const targetStudent = allUsers.find((u) => u.name === student);

    if (targetStudent) {
      const studentStorageKey = `studentMeetings_${targetStudent.email}`;

      const prev = JSON.parse(
        localStorage.getItem(studentStorageKey) || "[]"
      );

      localStorage.setItem(
        studentStorageKey,
        JSON.stringify([
          {
            date,
            topic,
            mentor: user.name
          },
          ...prev
        ])
      );
    }

    alert("Meeting logged successfully!");
    setTopic("");
    setStudent("");
    setDate("");
  };

  return (
    <div className="main-section">

      <h1 className="page-title">Mentor Meetings</h1>

      <div className="card-container">
        <table className="full-width-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Topic</th>
            </tr>
          </thead>

          <tbody>
            {meetings.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-row">
                  No meetings logged yet
                </td>
              </tr>
            ) : (
              meetings.map((m) => (
                <tr className="smooth-row" key={m.id}>
                  <td>{m.student}</td>
                  <td>{m.date}</td>
                  <td>{m.topic}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="form-card" style={{ marginTop: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Log New Meeting</h3>

        {/* Student Select */}
        <div className="input-row">
          <label className="form-label">Student</label>
          <select
            className="form-input"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
          >
            <option value="">Select student</option>

            {assignedStudents.map((s, i) => (
              <option key={i} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Meeting Topic */}
        <div className="input-row">
          <label className="form-label">Meeting Topic</label>
          <input
            className="form-input"
            placeholder="Performance review, attendance..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="input-row">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="submit-btn" onClick={handleAdd}>
          Log Meeting
        </button>
      </div>
    </div>
  );
}
