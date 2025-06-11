import React, { useState } from "react";

import { Outlet } from "react-router-dom";
import "./CustHome.css"; // Import styles
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Footer } from "../Components/Footer";
import CustNavbar from "./CustNavbar";
import CustSidebar from "./CustSidebar";



const CustHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-container">
      <CustNavbar toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <CustSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`content-area ${isSidebarOpen ? "expanded" : "collapsed"}`}>
          <div style={{marginTop:"-40px"}}>
          <Outlet />
          </div>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default CustHome;
