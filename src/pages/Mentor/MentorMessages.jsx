import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MentorMessages() {
  const { user } = useContext(AuthContext);

  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const STORAGE_KEY = "studentMessages";

  /* -------------------------------------------------------
     LOAD ASSIGNED STUDENTS (MENTOR STORED BY EMAIL)
  ------------------------------------------------------- */
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const students = allUsers.filter(
      (u) => u.role === "student" && u.mentor === user.name // ✅ FIXED HERE
    );

    setAssignedStudents(students);
  }, [user.email]);

  /* -------------------------------------------------------
     OPEN CHAT WITH A STUDENT
  ------------------------------------------------------- */
  const openChat = (student) => {
    setSelectedStudent(student);

    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const history = all[student.email] || [];
    setChat(history);
  };

  /* -------------------------------------------------------
     SEND MESSAGE TO ONE STUDENT
  ------------------------------------------------------- */
  const sendMessage = () => {
    if (!selectedStudent || message.trim() === "") return;

    const newMsg = {
      from: "mentor",
      text: message,
      time: new Date().toLocaleString(),
    };

    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const updated = [...(all[selectedStudent.email] || []), newMsg];

    all[selectedStudent.email] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    // 🚨 Add unread notification for student
    const unreadKey = `unread_${selectedStudent.email}`;
    const count = parseInt(localStorage.getItem(unreadKey) || "0");
    localStorage.setItem(unreadKey, count + 1);

    setChat(updated);
    setMessage("");
  };

  /* -------------------------------------------------------
     BROADCAST MESSAGE TO ALL ASSIGNED STUDENTS
  ------------------------------------------------------- */
  const broadcastToAll = () => {
    if (message.trim() === "") return;

    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    assignedStudents.forEach((student) => {
      const prev = all[student.email] || [];

      const msg = {
        from: "mentor",
        text: message,
        time: new Date().toLocaleString(),
      };

      all[student.email] = [...prev, msg];

      // 🚨 add unread for each student
      const unreadKey = `unread_${student.email}`;
      const count = parseInt(localStorage.getItem(unreadKey) || "0");
      localStorage.setItem(unreadKey, count + 1);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    alert("Message sent to all assigned students.");
    setMessage("");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Messages</h1>

      <div className="chat-layout">
        {/* LEFT SIDEBAR – STUDENT LIST */}
        <div className="chat-sidebar">
          <h3>Assigned Students</h3>

          {assignedStudents.length === 0 && <p>No students assigned.</p>}

          {assignedStudents.map((s) => (
            <div
              key={s.email}
              className={`chat-student ${
                selectedStudent?.email === s.email ? "active" : ""
              }`}
              onClick={() => openChat(s)}
            >
              {s.name}
            </div>
          ))}
        </div>

        {/* RIGHT CHAT WINDOW */}
        <div className="chat-window">
          {!selectedStudent ? (
            <p>Select a student to open chat.</p>
          ) : (
            <>
              <h3>Chat with {selectedStudent.name}</h3>

              <div className="message-container">
                {chat.map((m, i) => (
                  <div
                    key={i}
                    className={`message-card ${
                      m.from === "mentor" ? "me-msg" : ""
                    }`}
                  >
                    <div className="message-from">
                      {m.from === "mentor" ? "You" : selectedStudent.name}
                    </div>
                    <div className="message-text">{m.text}</div>
                    <div className="message-time">{m.time}</div>
                  </div>
                ))}
              </div>

              <textarea
                className="form-input"
                rows={3}
                placeholder="Type your message…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              <button className="submit-btn" onClick={sendMessage}>
                Send Message
              </button>

              <button
                className="submit-btn"
                style={{ background: "#1c3fa8", marginTop: "10px" }}
                onClick={broadcastToAll}
              >
                Broadcast to All Students
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
