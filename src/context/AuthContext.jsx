import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded admin account (cannot be deleted)
  const defaultAdmin = {
    name: "System Admin",
    email: "admin@college.com",
    password: "admin123",
    role: "admin",
  };

  // Load user + ensure admin exists
  useEffect(() => {
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // Ensure admin account always exists
    const adminExists = users.some((u) => u.role === "admin");
    if (!adminExists) {
      users.push(defaultAdmin);
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Load logged-in user
    try {
      const saved = JSON.parse(localStorage.getItem("authUser"));
      if (saved) setUser(saved);
    } catch (e) {
      console.error("Auth load error:", e);
    }

    setLoading(false);
  }, []);

  // Signup (admin cannot sign up)
  const signup = (newUser) => {
    if (newUser.role === "admin") {
      throw new Error("Admin account cannot be created.");
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === newUser.email)) {
      throw new Error("Email already exists");
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Login
  const login = (email, password, remember = true) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password");
    }

    setUser(found);

    if (remember) {
      localStorage.setItem("authUser", JSON.stringify(found));
    }

    return found;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signup, login, logout }}>

      {children}
    </AuthContext.Provider>
  );
}
