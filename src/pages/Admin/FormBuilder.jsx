import "../../styles/dashboard.css";
import { useState } from "react";

export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [fields, setFields] = useState([]);

  const addField = () => {
    const name = prompt("Enter field label:");
    if (!name) return;
    setFields([...fields, { id: Date.now(), label: name }]);
  };

  const deleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const saveForm = () => {
    if (!title.trim()) {
      alert("Form title is required.");
      return;
    }

    const formData = {
      id: Date.now(),
      title,
      desc,
      fields,
      created: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem("forms") || "[]");

    existing.push(formData);

    localStorage.setItem("forms", JSON.stringify(existing));

    alert("Form saved successfully.");

    setTitle("");
    setDesc("");
    setFields([]);
  };

  return (
    <div className="main-section">
      <h1 className="page-title">Form Builder</h1>

      <div className="form-card">

        <div className="input-row">
          <label className="form-label">Form Title</label>
          <input
            className="form-input"
            placeholder="Enter form title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-row">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Enter short description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        <button className="submit-btn" onClick={addField}>
          ➕ Add Field
        </button>
      </div>

      <table className="erp-table" style={{ marginTop: "25px" }}>
        <thead>
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {fields.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                No fields added yet.
              </td>
            </tr>
          ) : (
            fields.map((f) => (
              <tr key={f.id}>
                <td>{f.label}</td>
                <td>Text Input</td>
                <td>
                  <button className="table-btn delete-btn" onClick={() => deleteField(f.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {fields.length > 0 && (
        <button className="submit-btn" style={{ marginTop: "20px" }} onClick={saveForm}>
          ✔ Save Form
        </button>
      )}
    </div>
  );
}
