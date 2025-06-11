import React from 'react';

export const Footer = () => {
  return (
    <div style={{
      height: "30px", 
      // background: "#FFC300", 
      position: "fixed", // Keep it at the bottom of the page
      left: 0, // Ensure it stretches across the whole screen
      bottom: 0, // Stick it to the bottom
      width: "100%", // Take full width
      marginTop:"20px"
    }}>
      <p style={{
        background:"black",
        color: "white", 
        textAlign: "center", // Center the text
        margin: 0, // Remove any default margins on the h1 tag
        lineHeight: "30px", // Vertically center the text
        fontSize:'18px',
        fontWeight:500
      }}>
       Copyright © 2025 <a href='https://mauli-infotech.co.in/' target='_blank'  style={{ color: 'white', textDecoration: 'none' }}>Mauli Infotech (OPC) Pvt. Ltd.</a>
      </p>
    </div>
  );
};
