import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMessages() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  const STORAGE_KEY = "studentMessages";
  const UNREAD_KEY = `unread_${user.email}`;

  /* -------------------------------------------------------
     LOAD messages + clear unread badge
  ------------------------------------------------------- */
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const history = all[user.email] || [];
    setMessages(history);

    // Clear unread count when student opens the page
    localStorage.setItem(UNREAD_KEY, "0");
  }, [user.email]);

  /* -------------------------------------------------------
     SEND REPLY (mentor will see it in chat)
  ------------------------------------------------------- */
  const sendReply = () => {
    if (reply.trim() === "") return;
  
    const newMsg = {
      from: "student",
      text: reply,
      time: new Date().toLocaleString(),
    };
  
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const updated = [...(all[user.email] || []), newMsg];
  
    all[user.email] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  
    // 🔥 Add unread notification for mentor
    const mentorEmail = user.mentorEmail;  // stored earlier
    if (mentorEmail) {
      const unreadKey = `mentorUnread_${mentorEmail}`;
      const current = parseInt(localStorage.getItem(unreadKey) || "0");
      localStorage.setItem(unreadKey, String(current + 1));
    }
  
    setMessages(updated);
    setReply("");
  };
  

  return (
    <div className="main-section">
      <h1 className="page-title">Messages</h1>

      <div className="message-container">
        {messages.length === 0 && (
          <div className="empty">No messages yet.</div>
        )}

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

      {/* Reply box */}
      <div className="form-card" style={{ marginTop: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Send a Reply</h3>

        <textarea
          className="form-input"
          rows={4}
          placeholder="Write your reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        ></textarea>

        <button className="submit-btn" onClick={sendReply}>
          Send Reply
        </button>
      </div>
    </div>
  );
}
