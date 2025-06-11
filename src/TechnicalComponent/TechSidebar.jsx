import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUserPlus, FaMapMarkerAlt, FaBuilding, FaLayerGroup, FaDoorOpen, FaUserTie, FaClipboardCheck, FaTasks, FaChartBar, FaCog } from "react-icons/fa";
import "../Components/sidebar.css"; // Ensure styles are updated

const TechSidebar = ({ isOpen }) => {
  const menuItems = [
    { path: "/technical/techdashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/technical/room-checkpoint", label: "Area Check Point", icon: <FaClipboardCheck /> },
   
    // { path: "/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <NavLink to={item.path} className="nav-link" style={{ color: "yellow" }}>
              {item.icon} {isOpen && <span className="menu-label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechSidebar;
