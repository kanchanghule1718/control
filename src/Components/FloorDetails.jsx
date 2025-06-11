import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const FloorDetails = () => {
  const [floorData, setFloorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');
  const floorId = sessionStorage.getItem('FloorId'); // Get the selected floor ID from session storage

  useEffect(() => {
    const fetchFloorData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-roomsCheckpoint-byfloorid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: AuthApiKey,
            one: floorId, // Pass the floor ID to the API
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }

        const data = await response.json();

        if (data.success && data.rooms) {
          setFloorData(data.rooms); // Set the fetched room data
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
      
    if (floorId) {
      fetchFloorData();
    }
  }, [floorId]);

  const filteredRooms = floorData.filter((room) =>
    room.pec_rm_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();  // Retained just in case it's needed later

  return (
    <div className="location-detail-container">
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-3'>
        <h2 style={{ textAlign: "left" }}>All Rooms</h2>

        {/* ✅ Search input field */}
        <input
          type="text"
          placeholder="Search by room name..."
          className="search-input customer-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading && <p className="info-msg">Loading room data...</p>}
      {error && <p className="error-msg">{error}</p>}

      {floorData.length > 0 ? (
        <div className="table-wrapper">
          <table className="location-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Room Name</th>
                <th>Mode Of Treatment</th>
                {/* <th>Pest Product</th> */}
                <th>Findings</th>
                <th>Remark</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ cursor: 'pointer', color: '#0d6efd' }}>
                    {room.pec_rm_name}
                  </td>
                  <td>{room.pec_rmde_desc}</td>
                  {/* <td>{room.pec_rmde_pest_product}</td> */}
                  <td>{room.pec_rmde_findings}</td>
                  <td>{room.pec_rmde_treatment}</td>
                  <td>{room.em_uname}</td>
                  <td>{room.pec_rm_status}</td>
                  <td>{room.pec_rm_sdate?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="info-msg">No room data found.</p>
      )}
    </div>
  );
};
