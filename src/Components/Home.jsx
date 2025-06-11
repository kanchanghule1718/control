import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./home.css"; // Import styles
import { Footer } from "./Footer";


const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-container">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`content-area ${isSidebarOpen ? "expanded" : "collapsed"}`}>
          <div style={{marginTop:"-20px",marginLeft:"20px"}}>
          <Outlet />
          </div>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default Home;
