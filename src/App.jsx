import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

/* ---------------------------------------
   AUTH
---------------------------------------- */
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";

/* ---------------------------------------
   STUDENT
---------------------------------------- */
import StudentDashboard from "./pages/Student/StudentDashboard";
import Profile from "./pages/Student/Profile";
import FormsList from "./pages/Student/FormsList";
import FormView from "./pages/Student/FormView";
import Submissions from "./pages/Student/Submissions";
import Marks from "./pages/Student/Marks";
import StudentMessages from "./pages/Student/Messages";

import StudentMeetingForm from "./pages/Student/StudentMeetingForm";       
import StudentMeetings from "./pages/Student/Meetings";                   

/* ---------------------------------------
   MENTOR
---------------------------------------- */
import MentorDashboard from "./pages/Mentor/MentorDashboard";
import MentorStudents from "./pages/Mentor/Students";
import MentorMessages from "./pages/Mentor/MentorMessages";

import MentorStudentProfile from "./pages/Mentor/MentorStudentProfile";
import MentorMeetingRequests from "./pages/Mentor/MentorMeetingRequests";

/* ---------------------------------------
   HOD
---------------------------------------- */
import HodDashboard from "./pages/Hod/HodDashboard";
import AssignMentor from "./pages/Hod/AssignMentor";

/* ---------------------------------------
   ADMIN
---------------------------------------- */
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/Users";
import FormBuilder from "./pages/Admin/FormBuilder";



/* ---------------------------------------
   PROTECTED ROUTE
---------------------------------------- */
function ProtectedRoute({ children, allowed }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowed.includes(user.role))
    return <Navigate to="/login" replace />;

  return children;
}



/* ---------------------------------------
   MAIN ROUTER
---------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />



          {/* ========================================
               STUDENT ROUTES
          ========================================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowed={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/student/profile"
            element={<ProtectedRoute allowed={["student"]}><Profile /></ProtectedRoute>}
          />

          <Route path="/student/forms"
            element={<ProtectedRoute allowed={["student"]}><FormsList /></ProtectedRoute>}
          />

          <Route path="/student/form/:id"
            element={<ProtectedRoute allowed={["student"]}><FormView /></ProtectedRoute>}
          />

          <Route path="/student/submissions"
            element={<ProtectedRoute allowed={["student"]}><Submissions /></ProtectedRoute>}
          />

          <Route path="/student/marks"
            element={<ProtectedRoute allowed={["student"]}><Marks /></ProtectedRoute>}
          />

          <Route path="/student/messages"
            element={<ProtectedRoute allowed={["student"]}><StudentMessages /></ProtectedRoute>}
          />

          {/* NEW MEETING SYSTEM */}
          <Route
            path="/student/meeting-request"
            element={
              <ProtectedRoute allowed={["student"]}>
                <StudentMeetingForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/meetings"
            element={
              <ProtectedRoute allowed={["student"]}>
                <StudentMeetings />
              </ProtectedRoute>
            }
          />



          {/* ========================================
               MENTOR ROUTES
          ========================================= */}
          <Route
            path="/mentor"
            element={
              <ProtectedRoute allowed={["faculty"]}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/mentor/students"
            element={<ProtectedRoute allowed={["faculty"]}><MentorStudents /></ProtectedRoute>}
          />

          <Route path="/mentor/messages"
            element={<ProtectedRoute allowed={["faculty"]}><MentorMessages /></ProtectedRoute>}
          />

          {/* NEW: PENDING MEETING REQUESTS */}
          <Route path="/mentor/requests"
            element={<ProtectedRoute allowed={["faculty"]}><MentorMeetingRequests /></ProtectedRoute>}
          />

          {/* Mentor student profile */}
          <Route path="/mentor/student/:id"
            element={<ProtectedRoute allowed={["faculty"]}><MentorStudentProfile /></ProtectedRoute>}
          />



          {/* ========================================
               HOD ROUTES
          ========================================= */}
          <Route
            path="/hod"
            element={
              <ProtectedRoute allowed={["hod"]}>
                <HodDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/assign-mentor"
            element={
              <ProtectedRoute allowed={["hod"]}>
                <AssignMentor />
              </ProtectedRoute>
            }
          />



          {/* ========================================
               ADMIN ROUTES
          ========================================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/forms"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <FormBuilder />
              </ProtectedRoute>
            }
          />



          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
