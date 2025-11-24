import "../../styles/dashboard.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MentorStudentProfile() {
  const { id } = useParams(); // email used as ID
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u) => u.email === id);
    setStudent(found);
  }, [id]);

  if (!student) return <div className="main-section">Loading...</div>;

  return (
    <div className="main-section">
      <h1 className="page-title">Student Profile</h1>

      <div className="profile-card-wide">
        <h2>{student.name}</h2>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Roll No:</strong> {student.roll || "N/A"}</p>
        <p><strong>Branch:</strong> {student.branch || "N/A"}</p>
        <p><strong>Mentor:</strong> {student.mentor || "Not Assigned"}</p>
      </div>
    </div>
  );
}
