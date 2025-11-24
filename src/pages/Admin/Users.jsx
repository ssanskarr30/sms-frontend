import "../../styles/dashboard.css";
import { useState, useEffect } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(stored);
  }, []);

  const deleteUser = (email) => {
    if (!window.confirm("Delete this user?")) return;

    const updated = users.filter((u) => u.email !== email);

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    // Remove if user was logged in
    const active = JSON.parse(localStorage.getItem("authUser"));
    if (active && active.email === email) {
      localStorage.removeItem("authUser");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-section">

      {/* Page Title */}
      <h1 className="page-title">Manage Users</h1>

      {/* White Card Container */}
      <div className="card-container">

        {/* Search Bar */}
        <div className="table-header">
          <input
            className="search-input"
            placeholder="🔍 Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* USERS TABLE */}
        <table className="erp-table full-width-table">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "25%" }}>Email</th>
              <th style={{ width: "15%" }}>Role</th>
              <th style={{ width: "15%", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">No users found</td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={i} className="smooth-row">
                  <td>{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    <span className={`badge role-${u.role}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-delete"
                      onClick={() => deleteUser(u.email)}
                    >
                      Delete
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
