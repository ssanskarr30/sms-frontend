import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AssignMentor() {
  const { user, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");

  // Load students + mentors
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("users") || "[]");

    setStudents(
      all
        .filter((u) => u.role === "student")
        .map((u) => ({ ...u, mentor: u.mentor || "Not Assigned" }))
    );

    setMentors(all.filter((u) => u.role === "faculty"));
  }, []);

  const assignMentor = (email, mentor) => {
    let all = JSON.parse(localStorage.getItem("users") || "[]");

    all = all.map((u) =>
      u.email === email ? { ...u, mentor } : u
    );

    localStorage.setItem("users", JSON.stringify(all));

    setStudents(
      all
        .filter((u) => u.role === "student")
        .map((u) => ({ ...u, mentor: u.mentor || "Not Assigned" }))
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
      </div>

      {/* Main Section */}
      <div className="main-section">

        {/* Top Navbar */}
        <div className="top-navbar">
          <div className="top-navbar-left">
            <h2>Welcome, {user?.name}</h2>
          </div>
          <div className="top-navbar-right">
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <h1 className="page-title">Assign Mentors</h1>

        {/* White Card */}
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
                <th>Assign New</th>
                <th>Save</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No students found.
                  </td>
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
                          s.mentor === "Not Assigned"
                            ? "badge badge-red"
                            : "badge badge-green"
                        }
                      >
                        {s.mentor}
                      </span>
                    </td>

                    <td>
                      <select
                        id={`mentor-${i}`}
                        className="form-input"
                        style={{ padding: "6px" }}
                      >
                        {mentors.map((m) => (
                          <option key={m.email} value={m.email}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="table-btn"
                        onClick={() => {
                          const selected =
                            document.getElementById(`mentor-${i}`).value;
                          assignMentor(s.email, selected);
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
