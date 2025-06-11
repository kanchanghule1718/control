import React, { useState, useEffect } from 'react';
import './AllLocation.css';
import { useNavigate } from 'react-router-dom';

export const AllLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // ✅ New state

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-all-locations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey: AuthApiKey }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();

        if (data.success && data.locations) {
          setLocations(data.locations);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // ✅ Filter locations based on search input
  const filteredLocations = locations.filter((loc) =>
    loc.pec_loc_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();  // Initialize navigate function

  const getLocation = (id) => {
    sessionStorage.setItem('LocationId', id); // Store the location ID in session storage
    navigate('/admin/LocationDetail');  // Navigate to the LocationDetail page
  };

  return (
    <div className="location-container">
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-3'>
        <h2 style={{ textAlign: "left" }}>All Locations</h2>

        {/* ✅ Search input field */}
        <input
          type="text"
          placeholder="Search by location name..."
          className="search-input customer-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="info-msg">Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {filteredLocations.length > 0 ? (
        <div className="table-wrapper">
          <table className="location-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location Name</th>
                <th>Status</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((loc) => (
                <tr key={loc.pec_loc_id}>
                  <td>{loc.pec_loc_id}</td>
                  <td
                    onClick={() => getLocation(loc.pec_loc_id)}
                    style={{ cursor: 'pointer', color: '#0d6efd' }}
                  >
                    {loc.pec_loc_name.trim()}
                  </td>
                  <td>{loc.pec_loc_status}</td>
                  <td>{loc.pec_loc_sdate.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="info-msg">No locations found.</p>
      )}
    </div>
  );
};
