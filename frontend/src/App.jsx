import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Sidebar from "./components/sidebar";
import Middle from "./components/middle";
import Content from "./components/content";
import Courses from "./components/courses";
import Footer from "./components/footer";
import Center from "./components/center";
import Events from "./components/events";
import Testimonials from "./components/Testimonials";
import Login from "./Home_Page/Login";
import BaseHOD from "./adminHOD/baseHOD";
import Staff from "./staff/staff";
import Student from "./students/student";
import PrivateRoute from './components/privateRoute';
import { AuthContext } from './components/authContext';
import AdminHome from './adminHOD/adminHome';
import AddStaff from './adminHOD/add_staff';
import ManageStaff from "./adminHOD/manage_staff";
import StaffNotification from "./adminHOD/staff_notification";
import StaffFeedback from "./adminHOD/staff_feedback";
import Loader from "./components/loader";
import Marquee from "./components/Marquee";
import EditStaff from "./adminHOD/editStaff";
import AddBranch from "./adminHOD/add_branch";
import ManageBranches from "./adminHOD/manage_branch";
import EditBranch from "./adminHOD/edit_branch";
import AssignStaff from "./adminHOD/assign_staff";
import ManageAssignments from "./adminHOD/manage_assign";
import Students from "./adminHOD/students";
import StudentFeedback from "./adminHOD/StudentFeedback";
import AddStudent from "./adminHOD/add_student";
import StudentVideo from "./adminHOD/StudentVideo";
import UploadDiet from "./adminHOD/UploadDiet";
import ManageDiet from "./adminHOD/ManageDiet";
import SalaryManagement from "./adminHOD/SalaryManagement";
import PaymentDetails from "./adminHOD/PaymentDetails";
import PaySalary from "./adminHOD/PaySalary";
import ViewAttendance from "./adminHOD/view_attendance";


import './assets/images/cs_logo.png'
import './assets/images/profile-img.jpg'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Sidebar />
              <Navbar />
              <Hero />
              <section id="courses">
                <Courses />
              </section>
              <Middle />
              <Center />
              <Marquee />
              <section id="events">
                <Events />
              </section>
              <section id="about">
                <Testimonials />
              </section>
              <section id="contacts">
                <Content />
              </section>
              <Footer />
            </>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <BaseHOD />
            </PrivateRoute>
          }
        >
          <Route path="" element={<AdminHome />} />
          <Route path="add_staff" element={<AddStaff />} />
          <Route path="manage_staff" element={<ManageStaff />} />
          <Route path="staff_feedback" element={<StaffFeedback />} />
          <Route path="staff_notification" element={<StaffNotification />} />
          <Route path="edit_staff/:staffId" element={<EditStaff />} />
          <Route path="add_branch" element={<AddBranch />} />
          <Route path="manage_branch" element={<ManageBranches />} />
          <Route path="edit_branch/:branchId" element={<EditBranch />} />
          <Route path="assign_staff" element={<AssignStaff />} />
          <Route path="manage_assign" element={<ManageAssignments />} />
          <Route path="student_feedback" element={<StudentFeedback />} />
          <Route path="students" element={<Students />} />
          <Route path="add_student" element={<AddStudent />} />
          <Route path="student_video" element={<StudentVideo />} />
          <Route path="upload_diet" element={<UploadDiet />} />
          <Route path="manage_diet" element={<ManageDiet />} />
          <Route path="salary_management" element={<SalaryManagement />} />
          <Route path="payment_details" element={<PaymentDetails />} />
          <Route path="pay_salary" element={<PaySalary />} />
          <Route path="view_attendance" element={<ViewAttendance />} />

</Route>
        <Route 
          path="/staff" 
          element={
            <PrivateRoute>
              <Staff />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/student" 
          element={
            <PrivateRoute>
              <Student />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;