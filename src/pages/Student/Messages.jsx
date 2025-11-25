import "../../styles/dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";

/*
  FIXED VERSION:
  Messages stored under studentMessages[student.email][mentor.email]
*/

export default function StudentMessages() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [mentorEmail, setMentorEmail] = useState(null);
  const STORAGE = "studentMessages";

  useEffect(() => {
    if (!user) return;

    const all = JSON.parse(localStorage.getItem("users") || "[]");
    const me = all.find((u) => u.email === user.email) || user;

    // mentor stored as email ALWAYS
    setMentorEmail(me.mentor || null);

    const db = JSON.parse(localStorage.getItem(STORAGE) || "{}");
    const msgs = (db[user.email] && db[user.email][me.mentor]) || [];
    setMessages(msgs);
  }, [user?.email]);

  const sendReply = () => {
    if (!mentorEmail) {
      alert("No mentor assigned.");
      return;
    }
    if (reply.trim() === "") return;

    const newMsg = {
      from: "student",
      text: reply.trim(),
      time: new Date().toLocaleString(),
    };

    const db = JSON.parse(localStorage.getItem(STORAGE) || "{}");

    if (!db[user.email]) db[user.email] = {};
    if (!db[user.email][mentorEmail]) db[user.email][mentorEmail] = [];

    db[user.email][mentorEmail].push(newMsg);

    localStorage.setItem(STORAGE, JSON.stringify(db));
    setMessages([...db[user.email][mentorEmail]]);
    setReply("");

    // Increase mentor unread
    const unreadKey = `mentorUnread_${mentorEmail}`;
    const old = JSON.parse(localStorage.getItem(unreadKey) || "{}");
    old[user.email] = (old[user.email] || 0) + 1;
    localStorage.setItem(unreadKey, JSON.stringify(old));
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Messages</h1>

      <div className="message-container">
        {messages.length === 0 && <div className="empty">No messages yet.</div>}

        {messages.map((m, i) => (
          <div key={i} className={`message-card ${m.from === "student" ? "me-msg" : ""}`}>
            <div className="message-from">{m.from === "mentor" ? "Mentor" : "You"}</div>
            <div className="message-text">{m.text}</div>
            <div className="message-time">{m.time}</div>
          </div>
        ))}
      </div>

      <div className="form-card" style={{ marginTop: 20 }}>
        <h3>Send a Message</h3>

        <textarea
          className="form-input"
          rows={4}
          placeholder="Write..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <button className="submit-btn" onClick={sendReply}>
          Send
        </button>
      </div>
    </div>
  );
}
