import "../../styles/faculty.css";
import { useEffect, useState } from "react";

export default function FacultyDashboard() {
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSubs(JSON.parse(localStorage.getItem("submissions") || "[]").filter(s=>s.status==="submitted"));
  }, []);

  const open = (s) => setSelected(s);

  const takeAction = (action) => {
    if (!selected) return alert("Select a submission first");
    const all = JSON.parse(localStorage.getItem("submissions") || "[]");
    const idx = all.findIndex(x=>x.id===selected.id);
    if (idx===-1) return alert("Submission not found");
    if (action==="approve") all[idx].status = "verified";
    if (action==="reject") all[idx].status = "rejected";
    if (action==="revision") all[idx].status = "revision_requested";
    localStorage.setItem("submissions", JSON.stringify(all));
    setSubs(all.filter(s=>s.status==="submitted"));
    setSelected(null);
    alert("Action taken: " + action);
  };

  return (
    <div className="faculty-container">
      <div className="pending-list">
        <h3 style={{color:"#1a4db3"}}>Pending Submissions</h3>
        {subs.length===0 && <div style={{padding:16,background:"#fff",borderRadius:10,border:"1px dashed #e6eefc"}}>No pending submissions</div>}
        {subs.map(s => (
          <div className="fac-card" key={s.id}>
            <div>
              <div style={{fontWeight:700}}>{s.formId}</div>
              <div style={{fontSize:13,color:"#666"}}>Submitted at {new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <button className="action-btn request" onClick={()=>open(s)}>Open</button>
            </div>
          </div>
        ))}
      </div>

      <div className="review-panel">
        {selected ? (
          <>
            <h4 style={{color:"#163f8f"}}>{selected.formId}</h4>
            <pre style={{whiteSpace:"pre-wrap",fontSize:13,color:"#444"}}>{JSON.stringify(selected.data, null, 2)}</pre>

            <div style={{marginTop:12,display:"flex",gap:10}}>
              <button className="action-btn approve" onClick={()=>takeAction("approve")}>Approve</button>
              <button className="action-btn request" onClick={()=>takeAction("revision")}>Request Revision</button>
              <button className="action-btn reject" onClick={()=>takeAction("reject")}>Reject</button>
            </div>
          </>
        ) : <div style={{color:"#666"}}>Select a submission to review details</div>}
      </div>
    </div>
  );
}
