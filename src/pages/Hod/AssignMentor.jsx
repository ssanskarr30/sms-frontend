import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AssignMentor() {
  const { user, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");

  // Load all users (students + faculty)
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("users") || "[]");

    // Students
    setStudents(
      all
        .filter((u) => u.role === "student")
        .map((u) => ({
          ...u,
          mentorName: u.mentorName || "Not Assigned",
          mentorEmail: u.mentorEmail || "",
        }))
    );

    // Mentors (faculty)
    setMentors(
      all.filter((u) => u.role === "faculty")
    );
  }, []);

  // FIXED — now correctly stores BOTH mentorName + mentorEmail
  const assignMentor = (studentEmail, mentorName, mentorEmail) => {
    let all = JSON.parse(localStorage.getItem("users") || "[]");

    all = all.map((u) =>
      u.email === studentEmail
        ? {
            ...u,
            mentorName: mentorName,
            mentorEmail: mentorEmail,
          }
        : u
    );

    localStorage.setItem("users", JSON.stringify(all));

    // Update table UI
    setStudents(
      all
        .filter((u) => u.role === "student")
        .map((u) => ({
          ...u,
          mentorName: u.mentorName || "Not Assigned",
          mentorEmail: u.mentorEmail || "",
        }))
    );

    alert("Mentor assigned successfully.");
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🏛 HOD Panel</div>
        </div>

        <a className="sidebar-link" href="/hod">📊 Dashboard</a>
        <a className="sidebar-link active" href="/hod/assign-mentor">👨‍🏫 Assign Mentors</a>
        <a className="sidebar-link" href="/student/submissions">📁 View Submissions</a>

        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main Section */}
      <div className="main-section">
        <div className="top-navbar">
          <div className="top-navbar-left">
            <h2>Welcome, {user?.name}</h2>
          </div>
          <div className="top-navbar-right">
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <h1 className="page-title">Assign Mentors</h1>

        <div className="card-container">
          {/* Search */}
          <div className="table-header">
            <input
              className="search-input"
              placeholder="🔍 Search student by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <table className="erp-table full-width-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Roll No</th>
                <th>Current Mentor</th>
                <th>Assign New Mentor</th>
                <th>Save</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">No students found.</td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={i} className="smooth-row">
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.roll || "N/A"}</td>

                    <td>
                      <span
                        className={
                          s.mentorName === "Not Assigned"
                            ? "badge badge-red"
                            : "badge badge-green"
                        }
                      >
                        {s.mentorName}
                      </span>
                    </td>

                    <td>
                      <select
                        id={`mentor-${i}`}
                        className="form-input"
                        style={{ padding: "6px" }}
                      >
                        {mentors.map((m) => (
                          <option key={m.email} value={`${m.name}|${m.email}`}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="table-btn"
                        onClick={() => {
                          const [mentorName, mentorEmail] =
                            document.getElementById(`mentor-${i}`).value.split("|");

                          assignMentor(s.email, mentorName, mentorEmail);
                        }}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
