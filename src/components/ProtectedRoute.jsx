import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute
 * - allowed: array of roles permitted (e.g. ['student','faculty','hod'])
 * - If user is loading/absent -> redirect to /login (replace to avoid history back weirdness)
 * - If user's role not in allowed -> redirect to /login (or show unauthorized page)
 */
export default function ProtectedRoute({ allowed = [], children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    // Optionally show an "Unauthorized" page; for now redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
