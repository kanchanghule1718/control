import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pecopp-logo.png";
import "../Components/navbar.css"; // Import styles

const TechNavbar = ({ toggleSidebar }) => {
    const em_name = sessionStorage.getItem('em_name');
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="navbar-brand d-flex align-items-center" >
          <img src={logo} alt="PECOPP Logo" className="logo" />    
        </div>
        <p  className="para-one" style={{color:"yellow", fontSize:"18px", width:"155px", marginBottom:"0"}}>
          Hello {em_name}
        </p>
        <Link to={'/'} style={{textDecoration:"none"}}><span style={{ color:"white",fontSize:"18px",fontWeight:"700"}}>Logout</span></Link>
      </div>
    </nav>
  );
};

export default TechNavbar;
