import "../../styles/forms.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FormsList() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // In frontend-only mode we store forms in localStorage as "forms"
    const existing = JSON.parse(localStorage.getItem("forms") || "null");
    if (existing) setForms(existing);
    else {
      // seed one sample form if none
      const sample = [
        { id: "g1", title: "Semester Grade Sheet Request", description: "Upload your semester grade sheet for verification.", fields: [
          { name: "semester", label: "Semester", type: "select", options: ["1","2","3","4","5","6","7","8"], required: true },
          { name: "reason", label: "Reason for Request", type: "textarea", required: true },
          { name: "file", label: "Upload Grade Sheet", type: "file", required: true }
        ]}
      ];
      localStorage.setItem("forms", JSON.stringify(sample));
      setForms(sample);
    }
  }, []);

  return (
    <div className="forms-container">
      <h2 style={{color:"#1a4db3"}}>Available Forms</h2>
      {forms.length === 0 ? (
        <div className="empty-list">No forms published yet.</div>
      ) : (
        forms.map(f => (
          <div className="form-card" key={f.id}>
            <div className="form-meta">
              <div>
                <div className="form-title">{f.title}</div>
                <div className="form-desc">{f.description}</div>
              </div>
            </div>
            <div className="form-actions">
              <Link to={`/student/form/${f.id}`}>
                <button className="btn-primary">Fill</button>
              </Link>
              <button className="btn-secondary" onClick={() => alert("Preview not implemented")}>Preview</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
