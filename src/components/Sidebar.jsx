import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  const items = {
    student: [
      { to: "/student", label: "Dashboard" },
      { to: "/student/forms", label: "Available Forms" },
      { to: "/student/submissions", label: "My Submissions" },
      { to: "/student/profile", label: "Profile" },
    ],
    faculty: [
      { to: "/faculty", label: "Dashboard" },
      { to: "/faculty/review", label: "Pending Reviews" },
    ],
    admin: [
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/users", label: "User Management" },
      { to: "/admin/forms", label: "Form Builder" },
    ],
  };

  return (
    <div className="w-64 bg-[#1A4DB3] text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-6">CMS Portal</h2>

      <div className="space-y-3">
        {items[role]?.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block p-2 rounded hover:bg-blue-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
