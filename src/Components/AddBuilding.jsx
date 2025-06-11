import React, { useState, useEffect } from 'react';
import './AddBuilding.css';

const AddBuilding = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Retrieve the BASEURL from sessionStorage
const Base_Url = sessionStorage.getItem('BASEURL');
const AuthApiKey = sessionStorage.getItem('APIKEY');


  // Fetch locations when the component mounts
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocationId || !buildingName) {
      setMsg('Please select a location and enter a building name');
      return;
    }

    setLoading(true);
    setMsg('Submitting Building...');
    try {
      const response = await fetch(`${Base_Url}/add-building`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: AuthApiKey,
          one: buildingName,
          two: selectedLocationId,
          three:'1' // Assuming Added By is static
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Failed to add building');
    //console.log('building',result.message)

    if(result.message==='building added successfully'){
      setMsg(`${buildingName} Building added successfully!`);
      setBuildingName('');
      setSelectedLocationId('');
    }
    else{
      setMsg('Failed to add building, please try again');
    }
      
    } catch (err) {
      setMsg('Failed to add building' || err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 10000);
    }
  };
//console.log("id",selectedLocationId);

  return (
    <div className="add-building-container">
      <p style={{color:"rgb(143 172 93)",fontSize:"22px",fontWeight:"500",marginBottom:"0px"}}>Add Building</p>

      {error && <p className="error">Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Location:</label>
        {loading ? <p>Loading locations...</p> : (
          <select value={selectedLocationId} onChange={(e) => setSelectedLocationId(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.pec_loc_id} value={loc.pec_loc_id}>{loc.pec_loc_name}</option>
            ))}
          </select>
        )}

        <label>Building Name:</label>
        <input type="text" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} placeholder="Enter Building Name" />

        <button type="submit" disabled={loading}>Add Building</button>
        {msg && <p className='ShowMsg'>{msg}</p>}
      </form>
    </div>
  );
};

export default AddBuilding;
