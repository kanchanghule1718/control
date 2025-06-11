import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [visible, setVisible] = useState(false);



  useEffect(() => {
    setVisible(true);
  }, []); 

  const generateReport = async () => {
    try {
      const res = await fetch("http://localhost:5000/generate-location-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "ytfkenaojjawmbjnbsyyj-ppocpep",
          locationId: 1,
          filterType: "weekly"
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to generate report: " + errorData.message);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Pest_Report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Something went wrong!");
    }
  };

  const styles = {
    container: {
      padding: '40px',
      margin: "-30px",
      backgroundImage: 'url(https://media.istockphoto.com/id/1274283238/photo/common-ant-on-the-kitchen-table-close-to-food-need-for-pest-control.jpg?s=612x612&w=0&k=20&c=I-yo1bA_XCxHfuN3tKfCUt1fhsnKw-JI2xX1VLVnK54=)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      color: '#fff',
      transition: 'opacity 1s ease-in-out',
      opacity: visible ? 1 : 0,
    },
    header: {
      color: '#ffea00', // bright yellow
      fontSize: '42px',
      marginBottom: '30px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      textAlign: 'center',
      textShadow: '0 0 8px #ffd700, 0 0 16px #ffa500',
    },
    
    buttonContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      maxWidth: '900px',
      margin: '0 auto',
    },
    button: {
      background: 'linear-gradient(145deg, #badc81, #a9cc6a)', // subtle green gradient
      color: '#333', // darker text for contrast
      padding: '40px 0',
      border: 'none',
      borderRadius: '10px',
      fontSize: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      width: '100%',
      height: '100%',
      textAlign: 'center',
    },
    
    

  };

  return (
    <div style={styles.container}>
      <style>
        {`
          button:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
          }

          @media (max-width: 768px) {
            .button-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <h1 style={styles.header}>Admin Dashboard</h1>

      <div className="button-container" style={styles.buttonContainer}>
        <Link to="/admin/reports">
          <button style={styles.button}>
            📄 Download Weekly Report
          </button>
        </Link>

        <Link to="/admin/add-new-customer">
          <button style={styles.button}>➕ Add New Customer</button>
        </Link>

        <Link to="/admin/add-customer-location">
          <button style={styles.button}>📍 Add Customer Location</button>
        </Link>

        <Link to="/admin/all-Location">
          <button style={styles.button}>📂 View Locations</button>
        </Link>

        <Link to="/admin/add-building">
          <button style={styles.button}>🏢 Add Building</button>
        </Link>

        <Link to="/admin/add-employee">
          <button style={styles.button}>👤 Add Employee</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
