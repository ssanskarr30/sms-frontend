import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{background:'#fff', padding:'10px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eef5ff'}}>
      <div style={{fontWeight:700, color:'#1a4db3'}}>College CMS</div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        {!user && (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}

        {user && (
          <>
            {/* role based quick links */}
            {user.role === "student" && <Link to="/student">Dashboard</Link>}
            {user.role === "faculty" && <Link to="/mentor/students">Mentor Panel</Link>}
            {(user.role === "hod" || user.role === "admin") && <Link to="/hod/assign-mentor">HOD Panel</Link>}

            <span style={{color:'#666'}}>{user.name || user.email}</span>
            <button onClick={handleLogout} style={{background:'#ff6b6b', color:'#fff', border:'none', padding:'6px 10px', borderRadius:6}}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
