import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AddFloor = () => {
  const [locations, setLocations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [floorName, setFloorName] = useState('');
  const [wing, setWing] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-all-locations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: AuthApiKey }),
        });

        if (!response.ok) throw new Error('Failed to fetch locations');

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

  useEffect(() => {
    if (!selectedLocationId) return;
    const fetchBuildings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-buildingbyid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: AuthApiKey, one: selectedLocationId }),
        });

        if (!response.ok) throw new Error('Failed to fetch buildings');

        const data = await response.json();
        if (data.success && data.buildings) {
          setBuildings(data.buildings);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [selectedLocationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocationId || !selectedBuildingId || !floorName ) {
      setMsg('Please fill in all fields.');
      return;
    }

    setMsg('Submitting Floor...');

    try {
      const response = await axios.post(`${Base_Url}/add-floor`, {
        apiKey: AuthApiKey,
        one: floorName,
        two: "A",
        three: parseInt(selectedBuildingId),
        four: parseInt(selectedLocationId),
        five: 1 // Assuming added by is always 1
      });

      if (response.data.message?.toLowerCase().includes('success')) {
        setMsg(`Floor "${floorName}" added successfully!`);
        setFloorName('');
        setWing('');
        setSelectedLocationId('');
        setSelectedBuildingId('');
      } else if (response.data.message?.toLowerCase().includes('exists')) {
        setMsg(`Floor "${floorName}" already exists!`);
        setFloorName('');
      } else {
        setMsg(response.data.message || 'Failed to add floor. Please try again.');
      }
    } catch (error) {
      console.error('Error during floor submission:', error);
      setMsg(error.response?.data || 'Error occurred. Please try again later.');
    }

    setTimeout(() => {
      setMsg('');
    }, 10000);
  };

  return (
    <div className="add-building-container">
      <p style={{color:"rgb(143 172 93)",fontSize:"22px",fontWeight:"500",marginBottom:"0px"}}>Add Floor</p>
      
      <form onSubmit={handleSubmit} style={{padding:"10px"}}>
        <label>Location:</label>
        {loading ? (
          <p>Loading locations...</p>
        ) : (
          <select value={selectedLocationId} onChange={(e) => setSelectedLocationId(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.pec_loc_id} value={loc.pec_loc_id}>{loc.pec_loc_name}</option>
            ))}
          </select>
        )}

        <label>Building:</label>
        <select value={selectedBuildingId} onChange={(e) => setSelectedBuildingId(e.target.value)}>
          <option value="">Select Building</option>
          {buildings.map((building) => (
            <option key={building.pec_build_id} value={building.pec_build_id}>{building.pec_build_name}</option>
          ))}
        </select>

        <label>Floor Name:</label>
        <input type="text" value={floorName} onChange={(e) => setFloorName(e.target.value)} placeholder="Enter Floor Name" />

        {/* <label>Wing:</label>
        <input type="text" value={wing} onChange={(e) => setWing(e.target.value)} placeholder="Enter Wing (e.g., A, B, C)" /> */}

        <button type="submit">Add Floor</button>
        {msg && <p className='ShowMsg'>{msg}</p>}
        {error && <p className="error">Error: {error}</p>}
      </form>
    </div>
  );
};

export default AddFloor;
