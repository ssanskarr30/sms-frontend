import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMessages() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  const STORAGE = "studentMessages";

  useEffect(() => {
    const db = JSON.parse(localStorage.getItem(STORAGE) || "{}");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const me = users.find((u) => u.email === user.email);

    if (!me || !me.mentorEmail) return;

    const thread = db[user.email]?.[me.mentorEmail] || [];
    setMessages(thread);
  }, [user.email]);

  const sendReply = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const me = users.find((u) => u.email === user.email);

    if (!me?.mentorEmail) {
      alert("You do not have a mentor assigned.");
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
    if (!db[user.email][me.mentorEmail]) db[user.email][me.mentorEmail] = [];

    db[user.email][me.mentorEmail].push(newMsg);

    localStorage.setItem(STORAGE, JSON.stringify(db));

    setMessages([...db[user.email][me.mentorEmail]]);
    setReply("");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Messages</h1>

      <div className="message-container">
        {messages.length === 0 && <div className="empty">No messages yet.</div>}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`message-card ${m.from === "student" ? "me-msg" : ""}`}
          >
            <div className="message-from">
              {m.from === "mentor" ? "Mentor" : "You"}
            </div>
            <div className="message-text">{m.text}</div>
            <div className="message-time">{m.time}</div>
          </div>
        ))}
      </div>

      <div className="form-card" style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 10 }}>Send a Reply</h3>

        <textarea
          className="form-input"
          rows={4}
          placeholder="Write your message..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <button className="submit-btn" onClick={sendReply}>
          Send Reply
        </button>
      </div>
    </div>
  );
}
