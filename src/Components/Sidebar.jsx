import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUserPlus, FaMapMarkerAlt, FaBuilding, FaLayerGroup, FaDoorOpen, FaUserTie, FaClipboardCheck, FaTasks, FaChartBar, FaCog } from "react-icons/fa";
import "./sidebar.css"; // Ensure styles are updated

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    // { path: "/admin/add-new-customer", label: "Add Customer", icon: <FaUserPlus /> },
    { path: "/admin/add-customer-location", label: "Add Location", icon: <FaMapMarkerAlt /> },
    { path: "/admin/add-building", label: "Add Building", icon: <FaBuilding /> },
    { path: "/admin/add-floor", label: "Add Floor", icon: <FaLayerGroup /> },
    { path: "/admin/add-room", label: "Add Area", icon: <FaDoorOpen /> },
    { path: "/admin/add-employee", label: "Add Employee", icon: <FaUserTie /> },
    { path: "/admin/checkpoint-status", label: "Check Point Status", icon: <FaTasks /> },
    { path: "/admin/all-Location", label: "All Location", icon: <FaMapMarkerAlt /> },
    
    { path: "/admin/reports", label: "Reports", icon: <FaChartBar /> },
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

export default Sidebar;
