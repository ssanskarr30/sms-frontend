import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="mat-topbar">
      <div className="mat-topbar-left">
        <div className="mat-logo">College CMS</div>
        <div className="mat-top-search">
          <input placeholder="Search students, forms..." />
        </div>
      </div>

      <div className="mat-topbar-right">
        <div className="mat-user">
          <div className="mat-user-name">{user?.name || user?.email}</div>
          <button className="mat-logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
