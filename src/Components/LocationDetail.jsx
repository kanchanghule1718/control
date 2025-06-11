import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LocationDetail = () => {
  const [buildingData, setBuildingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');
  const locationId = sessionStorage.getItem('LocationId'); // Get the selected location ID from session storage

  useEffect(() => {
    const fetchBuildingData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-buildingbyid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: AuthApiKey,
            one: locationId, // Pass the location ID to the API
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch building data');
        }

        const data = await response.json();

        if (data.success && data.buildings) {
          setBuildingData(data.buildings); // Set the fetched building data
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchBuildingData();
    }
  }, [locationId]);

  const filteredbuilding = buildingData.filter((loc) =>
    loc.pec_build_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  const navigate = useNavigate();  // Initialize navigate function
  const buildinDetails = (id) => {
    sessionStorage.setItem('BuildingId', id); // Store the location ID in session storage
    navigate('/admin/BuildingDetail');  // Navigate to the LocationDetail page
  };


  return (
    <div className="location-detail-container">
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-3'>
        <h2 style={{ textAlign: "left" }}>All Buildings</h2>

        {/* ✅ Search input field */}
        <input
          type="text"
          placeholder="Search by building name..."
          className="search-input customer-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <p className="info-msg">Loading building data...</p>}
      {error && <p className="error-msg">{error}</p>}

      {buildingData.length > 0 ? (
        <div className="table-wrapper">
          <table className="location-table">
            <thead>
              <tr>
                {/* Add table headers according to the building data */}
                <th>Index</th>
                <th>Building Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredbuilding.map((building, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td
                   onClick={() => buildinDetails(building.pec_build_id)}
                   style={{ cursor: 'pointer', color: '#0d6efd' }}

                  >{building.pec_build_name}</td>
                  <td>{building.pec_build_status}</td>
                  <td>{building.pec_build_sdate.slice(0, 10)}</td> {/* Add other details as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="info-msg">No building data found.</p>
      )}
    </div>
  );
};
