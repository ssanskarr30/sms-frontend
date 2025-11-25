import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MentorMessages() {
  const { user } = useContext(AuthContext);

  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  const STORAGE = "studentMessages";

  // Load all assigned students
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("users") || "[]");

    const assigned = all.filter(
      (u) => u.role === "student" && u.mentorEmail === user.email
    );

    setAssignedStudents(assigned);
  }, [user.email]);

  // Load chat for selected student
  const openChat = (student) => {
    setSelected(student);

    const db = JSON.parse(localStorage.getItem(STORAGE) || "{}");

    const studentThread = db[student.email] || {};
    const thread = studentThread[user.email] || [];

    setChat(thread);

    // Clear unread count for this student
    const unreadKey = `mentorUnread_${user.email}`;
    const unreadMap = JSON.parse(localStorage.getItem(unreadKey) || "{}");
    unreadMap[student.email] = 0;
    localStorage.setItem(unreadKey, JSON.stringify(unreadMap));
  };

  // Send message to student
  const sendMessage = () => {
    if (!selected || msg.trim() === "") return;

    const newMsg = {
      from: "mentor",
      text: msg.trim(),
      time: new Date().toLocaleString(),
    };

    const db = JSON.parse(localStorage.getItem(STORAGE) || "{}");

    if (!db[selected.email]) db[selected.email] = {};
    if (!db[selected.email][user.email]) db[selected.email][user.email] = [];

    db[selected.email][user.email].push(newMsg);

    localStorage.setItem(STORAGE, JSON.stringify(db));

    setChat([...db[selected.email][user.email]]);
    setMsg("");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Messages</h1>

      <div className="chat-layout">
        {/* LEFT: Assigned Students */}
        <div className="chat-sidebar">
          <h3>Assigned Students</h3>

          {assignedStudents.length === 0 && <p>No students assigned.</p>}

          {assignedStudents.map((s) => (
            <div
              key={s.email}
              className={`chat-student ${
                selected?.email === s.email ? "active" : ""
              }`}
              onClick={() => openChat(s)}
            >
              {s.name}
            </div>
          ))}
        </div>

        {/* RIGHT: Chat Window */}
        <div className="chat-window">
          {!selected ? (
            <p>Select a student to open chat.</p>
          ) : (
            <>
              <h3>Chat with {selected.name}</h3>

              <div className="message-container">
                {chat.map((m, i) => (
                  <div
                    key={i}
                    className={`message-card ${
                      m.from === "mentor" ? "me-msg" : ""
                    }`}
                  >
                    <div className="message-from">
                      {m.from === "mentor" ? "You" : selected.name}
                    </div>
                    <div className="message-text">{m.text}</div>
                    <div className="message-time">{m.time}</div>
                  </div>
                ))}
              </div>

              <textarea
                className="form-input"
                rows={3}
                placeholder="Write message…"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />

              <button className="submit-btn" onClick={sendMessage}>
                Send
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
