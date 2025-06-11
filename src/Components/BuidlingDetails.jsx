import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const BuidlingDetails = () => {
  const [buildingData, setBuildingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');
  const buildingId = sessionStorage.getItem('BuildingId'); // Get the selected building ID from session storage

  useEffect(() => {
    const fetchBuildingData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-floorsbyid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: AuthApiKey,
            one: buildingId, // Pass the building ID to the API
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch floor data');
        }

        const data = await response.json();

        if (data.success && data.floors) {
          setBuildingData(data.floors); // Set the fetched floor data
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (buildingId) {
      fetchBuildingData();
    }
  }, [buildingId]);

  const filteredbuilding = buildingData.filter((floor) =>
    floor.pec_floor_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();  // Just in case it's needed later
  const floorDetails = (id) => {
    sessionStorage.setItem('FloorId', id); // Store the location ID in session storage
    navigate('/admin/FloorDetail');  // Navigate to the LocationDetail page
  };
  


  return (
    <div className="location-detail-container">
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-3'>
        <h2 style={{ textAlign: "left" }}>All Floors</h2>

        {/* ✅ Search input field */}
        <input
          type="text"
          placeholder="Search by floor name..."
          className="search-input customer-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <p className="info-msg">Loading floor data...</p>}
      {error && <p className="error-msg">{error}</p>}

      {buildingData.length > 0 ? (
        <div className="table-wrapper">
          <table className="location-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Floor Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredbuilding.map((floor, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ cursor: 'pointer', color: '#0d6efd' }}
                    onClick={() => floorDetails(floor.pec_floor_id)}
                    >
                    {floor.pec_floor_number}
                  </td>
                  <td>{floor.pec_floor_status}</td>
                  <td>{floor.pec_floor_sdate.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="info-msg">No floor data found.</p>
      )}
    </div>
  );
};
