import React from "react";
import { Link } from "react-router-dom";
import "../styles/material.css";
import Navbar from "./MaterialNavbar";
import Sidebar from "./MaterialSidebar";

export default function MaterialLayout({ children, role }) {
  return (
    <div className="mat-app">
      <Navbar role={role} />
      <div className="mat-body">
        <Sidebar role={role} />
        <main className="mat-main">{children}</main>
      </div>
    </div>
  );
}
