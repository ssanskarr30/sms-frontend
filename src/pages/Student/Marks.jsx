// src/pages/Student/Marks.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getItem, getMentorMap, getMeetings, getSubmissions, setItem } from "../../utils/storage"; // helper not default
import { getSubmissions as _getSubmissions, saveSubmissions } from "../../utils/storage";
import "../../styles/marks.css";

export default function Marks() {
  const { user } = useContext(AuthContext);
  const studentEmail = user?.email;
  const [semester, setSemester] = useState("1");
  const [subjects, setSubjects] = useState([{ name: "", marks: "" }]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load any saved draft for this user (optional)
    const drafts = JSON.parse(localStorage.getItem("marksDrafts") || "{}");
    if (drafts[studentEmail]) {
      const d = drafts[studentEmail];
      setSemester(d.semester || "1");
      setSubjects(d.subjects || [{ name: "", marks: "" }]);
      setNotes(d.notes || "");
    }
  }, [studentEmail]);

  const addRow = () => setSubjects(s => [...s, { name: "", marks: "" }]);
  const removeRow = (idx) => setSubjects(s => s.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) =>
    setSubjects(s => s.map((r, i) => i === idx ? { ...r, [field]: value } : r));

  const saveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem("marksDrafts") || "{}");
    drafts[studentEmail] = { semester, subjects, notes };
    localStorage.setItem("marksDrafts", JSON.stringify(drafts));
    setMessage("Draft saved locally.");
    setTimeout(()=>setMessage(""), 1800);
  };

  const submitMarks = () => {
    // Basic validation
    if (!studentEmail) return setMessage("User not found.");
    for (const r of subjects) {
      if (!r.name || r.marks === "") return setMessage("Please fill all subject rows.");
    }
    const submissions = _getSubmissions();
    const newSub = {
      id: `marks_${Date.now()}`,
      type: "marks",
      studentEmail,
      semester,
      subjects,
      notes,
      status: "submitted", // submitted -> mentor_verified -> hod_approved / rejected
      createdAt: new Date().toISOString(),
    };
    submissions.push(newSub);
    saveSubmissions(submissions);
    // clear draft
    const drafts = JSON.parse(localStorage.getItem("marksDrafts") || "{}");
    delete drafts[studentEmail];
    localStorage.setItem("marksDrafts", JSON.stringify(drafts));
    setMessage("Marks submitted. Await mentor verification.");
    setTimeout(()=>setMessage(""), 2500);
    // optionally clear fields
    setSubjects([{ name: "", marks: "" }]); setNotes(""); setSemester("1");
  };

  return (
    <div className="marks-container">
      <h2>Semester Marks Submission</h2>
      {message && <div className="info">{message}</div>}

      <div className="marks-controls">
        <label>Semester:
          <select value={semester} onChange={e=>setSemester(e.target.value)}>
            {Array.from({length:8}, (_,i)=>i+1).map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="marks-table">
        <div className="marks-header"><div>Subject</div><div>Marks / Grade</div><div></div></div>
        {subjects.map((r, idx) => (
          <div className="marks-row" key={idx}>
            <input placeholder="Subject name" value={r.name} onChange={e=>updateRow(idx,"name", e.target.value)} />
            <input placeholder="Marks" value={r.marks} onChange={e=>updateRow(idx,"marks", e.target.value)} />
            <button type="button" onClick={()=>removeRow(idx)} className="small">Remove</button>
          </div>
        ))}
        <button onClick={addRow} className="outline">Add Subject</button>
      </div>

      <div className="marks-notes">
        <label>Notes / Remarks</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4}></textarea>
      </div>

      <div className="marks-actions">
        <button onClick={saveDraft} className="secondary">Save Draft</button>
        <button onClick={submitMarks} className="primary">Submit to Mentor</button>
      </div>
    </div>
  );
}
