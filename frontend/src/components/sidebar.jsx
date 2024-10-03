import React from 'react';
import './sidebar.css';
import logo from '../assets/images/cs_logo.png';
const Sidebar = () => {
  const scrollToSection = (sectionId, event) => {
    event.preventDefault(); // Prevent the default link behavior

    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Section with ID ${sectionId} not found`);
    }
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
          <a href="#">
            <span className="material-symbols-outlined"> dashboard </span>Home
          </a>
        </li>
        <li>
          <a href="#" onClick={(event) => scrollToSection('courses', event)}>
            <span className="material-symbols-outlined"> overview </span>Courses
          </a>
        </li>
        <li>
          <a href="#" onClick={(event) => scrollToSection('events', event)}>
            <span className="material-symbols-outlined"> groups </span>Events
          </a>
        </li>
        <li>
          <a href="#" onClick={(event) => scrollToSection('about', event)}>
            <span className="material-symbols-outlined"> account_circle </span>About Us
          </a>
        </li>
        <li>
          <a href="#" onClick={(event) => scrollToSection('contacts', event)}>
            <span className="material-symbols-outlined"> folder </span>Contacts
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
