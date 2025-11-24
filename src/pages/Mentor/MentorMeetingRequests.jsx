import "../../styles/dashboard.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MentorMeetingRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    const pending = logs.filter(
      (l) =>
        l.mentorEmail === user.email &&
        l.status === "pending"
    );

    setRequests(pending);
  }, [user.email]);

  const approve = (id) => {
    let logs = JSON.parse(localStorage.getItem("meetingLogs") || "[]");

    logs = logs.map((l) =>
      l.id === id ? { ...l, status: "approved", approvedAt: new Date() } : l
    );

    localStorage.setItem("meetingLogs", JSON.stringify(logs));

    setRequests(requests.filter((r) => r.id !== id));

    alert("Meeting approved successfully.");
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Meeting Approvals</h1>

      <div className="table-card">
        <table className="erp-table clean-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  No pending requests.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.studentName}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td>{r.note}</td>
                  <td>
                    <button className="table-btn" onClick={() => approve(r.id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
