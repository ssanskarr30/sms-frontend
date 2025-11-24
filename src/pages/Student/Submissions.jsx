import "../../styles/submissions.css";
import { useEffect, useState } from "react";

export default function Submissions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    setSubs(JSON.parse(localStorage.getItem("submissions") || "[]"));
  }, []);

  return (
    <div className="submissions-container">
      <h2 style={{color:"#1a4db3"}}>My Submissions</h2>
      {subs.length === 0 ? (
        <div className="empty">You have not submitted any forms yet.</div>
      ) : (
        subs.map(s => (
          <div key={s.id} className="sub-row">
            <div>
              <div style={{fontWeight:700}}>{s.formId}</div>
              <div style={{color:"#666",fontSize:13}}>Submitted on {new Date(s.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <span className={`status-pill ${
                s.status==="submitted"?"status-submitted": s.status==="verified"?"status-verified": s.status==="approved"?"status-approved":"status-rejected"
              }`}>{s.status.toUpperCase()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
