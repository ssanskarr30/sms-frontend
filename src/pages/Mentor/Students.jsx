import "../../styles/dashboard.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function MentorStudents() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const assigned = users.filter(
      (u) => u.role === "student" && u.mentorEmail === user.email
    );

    setStudents(assigned);
  }, [user.email]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-section">

      <h1 className="page-title">Assigned Students</h1>

      {/* SEARCH BOX */}
      <div className="table-header" style={{ marginBottom: "20px" }}>
        <input
          className="search-input"
          placeholder="🔍 Search by name or roll..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d6dff5",
            fontSize: "15px"
          }}
        />
      </div>

      {/* TABLE CONTAINER CARD */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "14px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          marginTop: "10px"
        }}
      >
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ padding: "14px" }}>Name</th>
              <th style={{ padding: "14px" }}>Email</th>
              <th style={{ padding: "14px" }}>Roll No.</th>
              <th style={{ padding: "14px" }}>View Profile</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  No assigned students found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.email}
                  className="smooth-row"
                  style={{ height: "60px" }}
                >
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.roll || "N/A"}</td>

                  <td>
                    <a
                      className="table-btn"
                      href={`/mentor/student/${s.email}`}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "#1a4db3",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "14px",
                        textDecoration: "none"
                      }}
                    >
                      View
                    </a>
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
