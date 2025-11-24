import "../../styles/formview.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FormView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [formState, setFormState] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem("forms") || "[]");
    const f = forms.find(x => x.id === id);
    setSchema(f || null);
  }, [id]);

  const handleChange = (name, value) => setFormState(prev => ({...prev, [name]: value}));

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple validation
    for (const field of (schema?.fields || [])) {
      if (field.required && !formState[field.name]) {
        alert(`Please fill ${field.label || field.name}`);
        return;
      }
    }
    // store as submission
    const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    submissions.push({
      id: `sub_${Date.now()}`,
      formId: schema.id,
      data: formState,
      status: "submitted",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("submissions", JSON.stringify(submissions));
    setMessage("Submitted successfully — will go through approval workflow.");
    setTimeout(() => navigate("/student/submissions"), 1200);
  };

  if (!schema) return <div style={{padding:20}}>Form not found.</div>;

  return (
    <div className="formview-container">
      <div className="formview-title">{schema.title}</div>
      <div style={{marginBottom:10,color:"#666"}}>{schema.description}</div>

      {message && <div className="success-box">{message}</div>}

      <form onSubmit={handleSubmit}>
        {schema.fields.map(f => (
          <div className="form-field" key={f.name}>
            <label className="form-label">{f.label || f.name}{f.required && " *"}</label>

            {f.type === "text" && <input className="form-input" value={formState[f.name]||""} onChange={(e)=>handleChange(f.name,e.target.value)} />}
            {f.type === "textarea" && <textarea className="form-textarea" value={formState[f.name]||""} onChange={(e)=>handleChange(f.name,e.target.value)} rows={4} />}
            {f.type === "select" && (
              <select className="form-select" value={formState[f.name]||""} onChange={(e)=>handleChange(f.name,e.target.value)}>
                <option value="">Select</option>
                {(f.options||[]).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {f.type === "file" && <input type="file" className="form-file" onChange={(e)=>handleChange(f.name, e.target.files[0]?.name || "")} />}
          </div>
        ))}

        <div className="form-actions">
          <button className="btn-primary" type="submit">Submit</button>
          <button type="button" className="btn-secondary" onClick={()=>window.history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
