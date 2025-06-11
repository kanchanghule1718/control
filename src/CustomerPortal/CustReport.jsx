import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CustReport.css';
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const CustReport = () => {
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState(''); // For storing pec_loc_name
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [FloorName, setFloorName] = useState('')
  const [rooms, setRooms] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [error, setError] = useState('');
  const [BuildingsName, setBuildingsName] = useState('')

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');

  // Add references for the tables
  const locationRef = useRef(null);
  const buildingRef = useRef(null);
  const floorRef = useRef(null);
  const roomRef = useRef(null);

  // Fetch Locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.post(`${Base_Url}/get-all-locations`, { apiKey: AuthApiKey });
        if (response.data.success) {
          setLocationList(response.data.locations);
        }
      } catch (error) {
        setError('Failed to fetch locations');
      }
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    const selectedLocationId = e.target.value;
    setLocation(selectedLocationId); // Update pec_loc_id state
    setBuildings([]); // Reset buildings when location changes
    setBuildingsName('')
    setFloorName('')
    setFloors([]); // Reset floors when location changes
    setRooms([]); // Reset rooms when location changes
    // Convert selectedLocationId to a number to match the pec_loc_id type (assuming it's a number in locationList)
    const selectedLocation = locationList.find(loc => loc.pec_loc_id === Number(selectedLocationId));
    setLocationName(selectedLocation ? selectedLocation.pec_loc_name : ''); // Update pec_loc_name state

    // Scroll to the building table
    locationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch buildings based on selected location
  useEffect(() => {
    if (!location) return;
    const fetchBuildings = async () => {
      try {
        const response = await axios.post(`${Base_Url}/get-buildingbyid`, { apiKey: AuthApiKey, one: location });
        if (response.data.success) setBuildings(response.data.buildings);
      } catch (error) {
        setError('Failed to fetch buildings');
      }
    };
    fetchBuildings();
  }, [location]);

  // Fetch floors based on selected building
  const fetchFloors = async (buildingId) => {
    try {
      const response = await axios.post(`${Base_Url}/get-floorsbyid`, { apiKey: AuthApiKey, one: buildingId });
      if (response.data.success) setFloors(response.data.floors);
    } catch (error) {
      setError('Failed to fetch floors');
    }
  };

  // Fetch rooms based on selected floor
  const fetchRooms = async (floorId) => {
    try {
      const response = await axios.post(`${Base_Url}/get-roomsCheckpoint-byfloorid`, { apiKey: AuthApiKey, one: floorId });
      if (response.data.success) setRooms(response.data.rooms);
    } catch (error) {
      setError('Failed to fetch rooms');
    }
  };

  const handleShowFloors = (buildingId, buildingName) => {
    fetchFloors(buildingId);
    setBuildingsName(buildingName);        // Set the building name when the button is clicked
    setRooms([]);              // Reset rooms when building changes
    // Scroll to the floor table
    buildingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleshowRooms = (floorId, floorName) => {
    fetchRooms(floorId);
    setFloorName(floorName)
    // Scroll to the rooms table
    floorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  //download report coding start here
  const handleDownloadReport = () => {
    if (!location || buildings.length === 0) {
      alert("No data available to download.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Location,Building,Floor,Area,Treatment,Technician,Date,Time,Status\n";

    buildings.forEach(building => {
      const relevantFloors = floors.filter(floor => floor.pec_build_id === building.pec_build_id);
      relevantFloors.forEach(floor => {
        const relevantRooms = rooms.filter(room => room.pec_floor_id === floor.pec_floor_id);
        relevantRooms.forEach(room => {
          csvContent += `${locationName},${building.pec_build_name},${floor.pec_floor_number},${room.pec_rm_name},${room.pec_rmde_desc || "No Treatment"
            },${room.em_uname || "---"},${room.pec_rmde_sdate ? room.pec_rmde_sdate.split('T')[0] : "---"},${room.pec_rmde_sdate ? room.pec_rmde_sdate.split('T')[1].split('.')[0] : "---"
            },${room.pec_rm_status}\n`;
        });

        // If no rooms, add only floor-level data
        if (relevantRooms.length === 0) {
          csvContent += `${locationName},${building.pec_build_name},${floor.pec_floor_number},No Areas Available,---,---,---,---,---\n`;
        }
      });

      // If no floors, add only building-level data
      if (relevantFloors.length === 0) {
        csvContent += `${locationName},${building.pec_build_name},No Floors Available,---,---,---,---,---,---\n`;
      }
    });

    // If no buildings, add only location-level data
    if (buildings.length === 0) {
      csvContent += `${locationName},No Buildings Available,---,---,---,---,---,---,---\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `CheckPointStatusReport_${locationName}.csv`);
  };

  //----------------------Download pdf report------------------------------
  const handleDownloadPDF = async () => {
    const element = document.querySelector(".checkpoint-status-container"); // Select the full report container
    if (!element) {
      alert("No data available to download.");
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 }); // Capture full report as image
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const bottomPadding = 15; // Extra space at the bottom of each page

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 0; // Position of the image on each page


    while (yPosition < imgHeight) {
      pdf.addImage(imgData, "PNG", 0, -yPosition, imgWidth, imgHeight);
      

      yPosition += pageHeight - 5; // Move down for next section

      if (yPosition < imgHeight) {
        pdf.addPage(); // Add new page if content remains
      }
    }

    pdf.save(`CheckPointStatusReport_${locationName}.pdf`);
  };

  //function for buton styling
  let selectedBuilding = null;
  let selectedFloor = null;

  function selectBuilding(button) {
    if (selectedBuilding) {
      selectedBuilding.classList.remove("selected-btn");
    }

    selectedBuilding = button;
    selectedBuilding.classList.add("selected-btn");

    // Reset floor selection when changing building
    if (selectedFloor) {
      selectedFloor.classList.remove("selected-btn");
      selectedFloor = null;
    }
  }

  function selectFloor(button) {
    if (selectedFloor) {
      selectedFloor.classList.remove("selected-btn");
    }

    selectedFloor = button;
    selectedFloor.classList.add("selected-btn");

    // Keep the selected building highlighted
    if (selectedBuilding) {
      selectedBuilding.classList.add("selected-btn");
    }
  }

  return (
    <>
    
      <p style={{ color: "rgb(143 172 93)", fontSize: "22px", fontWeight: "500", marginBottom: "0px",padding: "10px" }}>Check Point Status</p>


      <div className="checkpoint-status-container">
      <h4 style={{color:'#FFC300',textAlign:"center"}}>Pecopp Pest Control</h4>
        <label style={{ color: "#6d5b00" }}>Location:</label>
        <select value={location} onChange={handleLocationChange}>
          <option value="">Select Location</option>
          {locationList.map((loc) => (
            <option key={loc.pec_loc_id} value={loc.pec_loc_id}>
              {loc.pec_loc_name}
            </option>
          ))}
        </select>


        {location && buildings.length > 0 ? (
          <div ref={buildingRef}>
            <p style={{ color: "#6d5b00", fontSize: "20px", fontWeight: "600" }}>Buildings in {locationName}</p>
            <table className='check_table building_check_table'>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Sr.No.</th>
                  <th style={{ width: "55%" }}>Building Name</th>
                  <th style={{ width: "20%" }}>Status</th>
                  <th style={{ width: "20%" }}>Floors</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((building, index) => (
                  <tr key={building.pec_build_id}>
                    <td>{index + 1}</td>
                    <td>{building.pec_build_name}</td>
                    <td>{building.pec_build_status}</td>
                    <td>
                      <button onClick={(event) => { handleShowFloors(building.pec_build_id, building.pec_build_name); selectBuilding(event.currentTarget); }}>Show Floors</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : location && buildings.length === 0 ? (
          <div ref={buildingRef}>
            <h2 style={{ color: "#6d5b00", fontSize: "22px" }}>Buildings in {locationName}</h2>
            <p style={{ color: "green" }}>No buildings available for this location.</p>
          </div>
        ) : null}



        {buildings.length > 0 && floors.length > 0 ? (
          <div ref={floorRef}>
            <h2 style={{ color: "#6d5b00", fontSize: "20px", fontWeight: "600" }}>Floors in - {BuildingsName} Building</h2>
            <table className='check_table floor_check_table'>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Sr.No.</th>
                  <th style={{ width: "55%" }}>Floor Name</th>
                  <th style={{ width: "20%" }}>Status</th>
                  <th style={{ width: "20%" }}>Areas</th>
                </tr>
              </thead>
              <tbody>
                {floors.map((floor, index) => (
                  <tr key={floor.pec_floor_id}>
                    <td>{index + 1}</td>
                    <td>{floor.pec_floor_number}</td>
                    <td>{floor.pec_floor_status}</td>
                    <td>
                      <button onClick={(event) => { handleshowRooms(floor.pec_floor_id, floor.pec_floor_number); selectFloor(event.currentTarget); }}>Show Area</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : buildings.length > 0 && BuildingsName && floors.length === 0 ? (
          <div ref={floorRef}>
            <h2 style={{ color: "#6d5b00", fontSize: "22px" }}>Floors in - {BuildingsName} Building</h2>
            <p style={{ color: "green" }}>No floors available for this building.</p>
          </div>
        ) : null}



        {floors.length > 0 && rooms.length > 0 ? (
          <div ref={roomRef}>
            <h2 style={{ color: "#6d5b00", fontSize: "20px", fontWeight: "600" }}>Area in {FloorName} Floor</h2>
            <table className='check_table'>
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>Treatment</th>
                  <th>Technician </th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Findings</th>
                  <th>Remark</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.pec_rm_id}>
                    <td>{room.pec_rm_name}</td>
                    <td>{room.pec_rmde_desc === null ? 'No Treatment' : room.pec_rmde_desc}</td>

                    <td>{room.em_uname ? (<div>{room.em_uname}</div>) :
                      (<div>---</div>

                      )}</td>
                    <td>{room.pec_rmde_sdate ? room.pec_rmde_sdate.split(' ')[0] : '---'}</td>
                    <td>{room.pec_rmde_sdate ? room.pec_rmde_sdate.split(' ')[1] : '---'}</td>

                    <td>{room.pec_rmde_findings ? (room.pec_rmde_findings) : '---'}</td>
                    <td>{room.pec_rmde_treatment ? (room.pec_rmde_treatment) : '---'}</td>
                    <td style={{ color: "green" }}>{room.pec_rm_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : floors.length > 0 && FloorName && rooms.length === 0 ? (
          <div ref={roomRef}>
            <h2 style={{ color: "#6d5b00", fontSize: "22px" }}>Area in {FloorName} Floor</h2>
            <p style={{ color: "green" }}>No Area available for this floor.</p>
          </div>
        ) : null}


        {error && <p className="error-message">{error}</p>}

        {/* {floors.length > 0 && rooms.length > 0 ? (<button onClick={handleDownloadPDF} style={{margin:"5px"}} >
          Download PDF Report
        </button>):('')} */}
        

      </div>
      {/* <button onClick={handleDownloadReport} style={{ margin: "10px", padding: "8px 16px", backgroundColor: "#6d5b00", color: "white", border: "none", cursor: "pointer" }}>
  Download Report
</button> */}

    </>
  );
};

export default CustReport;
