import React from "react";
import { Link } from "react-router-dom";

const common = [
  { to: "/student/profile", label: "Profile", roles: ["student","faculty","hod","admin"] },
];

const navs = {
  student: [
    { to: "/student", label: "Dashboard" },
    { to: "/student/marks", label: "Marks" },
    { to: "/student/forms", label: "Forms" },
    { to: "/student/messages", label: "Messages" },
  ],
  faculty: [
    { to: "/mentor/students", label: "Students" },
    { to: "/mentor/meetings", label: "Meetings" },
    { to: "/mentor/messages", label: "Messages" },
  ],
  hod: [
    { to: "/hod", label: "Dashboard" },
    { to: "/hod/assign-mentor", label: "Assign Mentor" },
  ],
  admin: [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/users", label: "User Management" },
  ],
};

export default function Sidebar({ role }) {
  const items = navs[role] || [];
  return (
    <aside className="mat-sidebar">
      <div className="mat-side-inner">
        <nav>
          {items.map(i => (
            <Link key={i.to} to={i.to} className="mat-side-link">{i.label}</Link>
          ))}
        </nav>

        <div className="mat-side-divider" />

        <nav>
          {common.map(c => (
            <Link key={c.to} to={c.to} className="mat-side-link">{c.label}</Link>
          ))}
        </nav>
      </div>
      <div className="mat-pdf-ref">
        Spec: <a href="#" title="Original spec file">{"/mnt/data/Student Monitoring App Concept (1).pdf"}</a>
      </div>
    </aside>
  );
}
