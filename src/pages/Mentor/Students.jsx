import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MentorStudents() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const assigned = allUsers.filter(
      (u) => u.role === "student" && u.mentor === user.email
    );

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const withStatus = assigned.map((s) => {
      const logs = JSON.parse(
        localStorage.getItem(`studentMeetings_${s.email}`) || "[]"
      );
      const metThisMonth = logs.some((m) => {
        const d = new Date(m.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      return { ...s, metThisMonth };
    });

    setStudents(withStatus);
  }, [user]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-section">
      <h1 className="page-title">Assigned Students</h1>

      <div className="table-header">
        <input
          className="search-input"
          placeholder="🔍 Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card-container">
        <table className="full-width-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roll No</th>
              <th>Meeting Status</th>
              <th>Profile</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  No students assigned to you yet
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr className="smooth-row" key={i}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.roll || "N/A"}</td>
                  <td>
                    {s.metThisMonth ? (
                      <span className="badge badge-green">
                        ✔ Met This Month
                      </span>
                    ) : (
                      <span className="badge badge-red">
                        ❗ Meeting Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="table-btn"
                      onClick={() => navigate(`/mentor/student/${s.email}`)}
                    >
                      View Profile
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
