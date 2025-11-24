import "../../styles/dashboard.css";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentMeetingStatus() {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("not_submitted");
  const [log, setLog] = useState(null);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const entry = logs.find(
      (l) =>
        l.studentEmail === user.email &&
        l.month === month &&
        l.year === year
    );

    if (!entry) {
      setStatus("not_submitted");
    } else if (entry.status === "pending") {
      setStatus("pending");
    } else if (entry.status === "approved") {
      setStatus("approved");
    }

    setLog(entry);
  }, [user.email]);

  return (
    <div className="main-section">
      <h1 className="page-title">Meeting Status</h1>

      <div className="card-container">
        {status === "not_submitted" && (
          <p>You haven't submitted your monthly meeting yet.</p>
        )}

        {status === "pending" && (
          <p>Your meeting log is pending mentor approval.</p>
        )}

        {status === "approved" && (
          <p>
            Your meeting for this month has been <b>approved</b> by the mentor.
          </p>
        )}
      </div>

      {log && (
        <div className="card-container" style={{ marginTop: 20 }}>
          <h3>Meeting Details</h3>
          <p><b>Date:</b> {new Date(log.date).toLocaleString()}</p>
          <p><b>Notes:</b> {log.note}</p>
        </div>
      )}
    </div>
  );
}
