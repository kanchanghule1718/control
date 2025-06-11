import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pecopp-logo.png";
import "./CustNavbar.css"; // Import styles

const CustNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="navbar-brand d-flex align-items-center" >
          <img src={logo} alt="PECOPP Logo" className="logo" />    
        </div>
        <p  className="para-one" style={{color:"yellow", fontSize:"18px", width:"250px", marginBottom:"0"}}>
          Hi Nandu (Customer)
        </p>
        <Link to={'/'} style={{textDecoration:"none"}}><span style={{ color:"white",fontSize:"18px",fontWeight:"700"}}> Logout</span></Link>
        

      </div>
    </nav>
  );
};

export default CustNavbar;
