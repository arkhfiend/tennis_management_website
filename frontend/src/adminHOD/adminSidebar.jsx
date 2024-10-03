import React, { useState } from 'react';
import '../components/sidebar.css';
import './adminstyle.module.css'
import { Link } from 'react-router-dom';
import logo from '../assets/images/cs_logo.png'
import profile from '../assets/images/profile-img.jpg'

const AdminSidebar = () => {
  const [isStaffCollapsed, setIsStaffCollapsed] = useState(false);
  const [isStudentCollapsed, setIsStudentCollapsed] = useState(false);
  const [isBranchesCollapsed, setIsBranchesCollapsed] = useState(false);
  const [isAssignCollapsed, setIsAssignCollapsed] = useState(false);
  const [isDietPlanCollapsed, setIsDietPlanCollapsed] = useState(false);

  const toggleStaffCollapse = () => {
    setIsStaffCollapsed(!isStaffCollapsed);
  };

  const toggleStudentCollapse = () => {
    setIsStudentCollapsed(!isStudentCollapsed);
  };

  const toggleBranchesCollapse = () => {
    setIsBranchesCollapsed(!isBranchesCollapsed);
  };

  const toggleAssignCollapse = () => {
    setIsAssignCollapsed(!isAssignCollapsed);
  };

  const toggleDietPlanCollapse = () => {
    setIsDietPlanCollapsed(!isDietPlanCollapsed);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="logo" />
        <h2>CS Tennis</h2>
      </div>
      <ul className="sidebar-links">
        <h4>
          <span>Main Menu</span>
          <div className="menu-separator"></div>
        </h4>
        <li>

          <Link to="/admin">
          <span className="material-symbols-outlined"> overview </span>Home
          </Link>

        </li>
        <li>
          <a href="#" onClick={toggleStaffCollapse}>
            <span className="material-symbols-outlined"> groups </span>Staff
          </a>
          {isStaffCollapsed && (
            <ul className="submenu">
              <li>
              <Link to="/admin/add_staff">
  <span className="material-symbols-outlined">person_add</span>
  Add Staff
</Link>
              </li>
              <li>
              <Link to="/admin/manage_staff">
  <span className="material-symbols-outlined"> manage_accounts </span>
  Manage Staff
</Link>
              </li>
              <li>
  <Link to="/admin/staff_notification">
    <span className="material-symbols-outlined"> notifications </span>Send Notification
  </Link>
</li>
              <li>
                <Link to="/admin/staff_feedback">
                <span className="material-symbols-outlined"> feedback </span>Staff Feedback
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
<Link to="/admin/students">
<span className="material-symbols-outlined"> school </span>Student
</Link>
</li>
        <li>
          <a href="#" onClick={toggleBranchesCollapse}>
            <span className="material-symbols-outlined"> account_tree </span>Branches
          </a>
          {isBranchesCollapsed && (
            <ul className="submenu">
              <li>
  <Link to="/admin/add_branch">
    <span className="material-symbols-outlined"> add_business </span>Add Branches
  </Link>
</li>
<li>
  <Link to="/admin/manage_branch">
    <span className="material-symbols-outlined"> manage_accounts </span>Manage Branches
  </Link>
</li>
            </ul>
          )}
        </li>
        <li>
          <a href="#" onClick={toggleAssignCollapse}>
            <span className="material-symbols-outlined"> assignment </span>Assign
          </a>
          {isAssignCollapsed && (
            <ul className="submenu">
              <li>
    <Link to="/admin/assign_staff">
        <span className="material-symbols-outlined"> person_add </span>Assign Staff
    </Link>
</li>
              <li>
              <Link to="/admin/manage_assign">
              <span className="material-symbols-outlined"> manage_accounts </span>Manage Assign
              </Link>
              </li>
            </ul>
          )}
        </li>
<li>
  <a href="#" onClick={toggleDietPlanCollapse}>
    <span className="material-symbols-outlined"> restaurant_menu </span>Diet Plan
  </a>
  {isDietPlanCollapsed && (
    <ul className="submenu">
      <li>
        <Link to="/admin/upload_diet">
          <span className="material-symbols-outlined"> fastfood </span>Give Diet
        </Link>
      </li>
      <li>
        <Link to="/admin/manage_diet">
          <span className="material-symbols-outlined"> manage_accounts </span>Manage Diet
        </Link>
      </li>
    </ul>
  )}
</li>
<li>
  <Link to="/admin/student_video">
    <span className="material-symbols-outlined"> videocam </span>Send Student Video
  </Link>
</li>
<li>
  <Link to="/admin/view_attendance">
    <span className="material-symbols-outlined">visibility</span>View Attendance
  </Link>
</li>
<li>
  <a href="#" onClick={toggleDietPlanCollapse}>
    <span className="material-symbols-outlined">payments</span>Payments
  </a>
  {isDietPlanCollapsed && (
    <ul className="submenu">
      <li>
        <Link to="/admin/payment_details">
          <span className="material-symbols-outlined">account_balance_wallet</span>Student Payment
        </Link>
      </li>
      <li>
        <Link to="/admin/salary_management">
          <span className="material-symbols-outlined">account_balance</span>Staff Salary
        </Link>
      </li>
      <li>
        <Link to="/admin/pay_salary">
          <span className="material-symbols-outlined">account_balance</span>Staff Payment
        </Link>
      </li>
    </ul>
  )}
</li>


        <h4>
          <span>Account</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"> account_circle </span>Profile
          </a>
        </li>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"> settings </span>Settings
          </a>
        </li>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"> logout </span>Logout
          </a>
        </li>
      </ul>
      <div className="user-account">
        <div className="user-profile">
          <img src={profile} alt="Profile Image" />
          <div className="user-detail">
            <h3>Aarya khanvilkar</h3>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;