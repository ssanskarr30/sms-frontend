import "../../styles/dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";

/*
  Student messages are stored per mentorName.
  When student sends, increment mentor unread map under mentorName.
*/

export default function StudentMessages() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [mentorName, setMentorName] = useState(null);

  useEffect(() => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem("users") || "[]");
    const me = all.find((u) => u.email === user.email) || user;
    setMentorName(me.mentor || null);

    const store = JSON.parse(localStorage.getItem("studentMessages") || "{}");
    const msgs = (store[user.email] && store[user.email][me.mentor]) || [];
    setMessages(msgs);
  }, [user?.email]);

  function sendReply() {
    if (!mentorName) {
      alert("No mentor assigned.");
      return;
    }
    if (reply.trim() === "") return;

    const newMsg = {
      from: "student",
      text: reply.trim(),
      time: new Date().toLocaleString(),
    };

    const all = JSON.parse(localStorage.getItem("studentMessages") || "{}");
    all[user.email] = all[user.email] || {};
    all[user.email][mentorName] = all[user.email][mentorName] || [];
    all[user.email][mentorName].push(newMsg);
    localStorage.setItem("studentMessages", JSON.stringify(all));
    setMessages([...all[user.email][mentorName]]);
    setReply("");

    // increment mentor unread counter
    const key = `mentorUnread_${mentorName}`;
    const cur = JSON.parse(localStorage.getItem(key) || "{}");
    cur[user.email] = (cur[user.email] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(cur));
  }

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
        <h3 style={{ marginBottom: 10 }}>Send a Message to Mentor</h3>

        <textarea
          className="form-input"
          rows={4}
          placeholder={mentorName ? "Write your message..." : "No mentor assigned."}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          disabled={!mentorName}
        />

        <button className="submit-btn" onClick={sendReply} disabled={!mentorName}>
          Send
        </button>
      </div>
    </div>
  );
}
