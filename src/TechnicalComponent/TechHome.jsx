import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./TechHome.css"; // Import styles
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Footer } from "../Components/Footer";
import TechNavbar from "./TechNavbar";
import TechSidebar from "./TechSidebar";

const TechHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 🔧 Closed by default

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-container">
      <TechNavbar toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <TechSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`content-area ${isSidebarOpen ? "expanded" : "collapsed"}`}>
          <div style={{ marginTop: "-40px" }}>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TechHome;
