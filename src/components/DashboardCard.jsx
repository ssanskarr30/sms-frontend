import React from "react";

export default function DashboardCard({ title, value, icon, children }) {
  return (
    <div className="mat-card">
      <div className="mat-card-head">
        <div className="mat-card-icon">{icon}</div>
        <div>
          <div className="mat-card-title">{title}</div>
          <div className="mat-card-value">{value}</div>
        </div>
      </div>
      {children && <div className="mat-card-body">{children}</div>}
    </div>
  );
}
