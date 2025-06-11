import React, { useState, useEffect } from 'react';


const AddRoom = () => {
  const [locations, setLocations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Retrieve the BASEURL and APIKEY from sessionStorage
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

  // Fetch buildings when a location is selected
  useEffect(() => {
    if (selectedLocationId) {
      const fetchBuildings = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${Base_Url}/get-buildingbyid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey: AuthApiKey,
              one: selectedLocationId,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch buildings');
          }

          const data = await response.json();

          if (data.success && data.buildings) {
            setBuildings(data.buildings);
            console.log('buildings',data.buildings);
            
          } else {
            throw new Error('Invalid data format for buildings');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBuildings();
    }
  }, [selectedLocationId]);

  // Fetch floors when a building is selected
  useEffect(() => {
    if (selectedBuildingId) {
      const fetchFloors = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${Base_Url}/get-floorsbyid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey: AuthApiKey,
              one: selectedBuildingId,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch floors');
          }

          const data = await response.json();

          if (data.success && data.floors) {
            setFloors(data.floors);
          } else {
            throw new Error('Invalid data format for floors');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFloors();
    }
  }, [selectedBuildingId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocationId || !selectedBuildingId || !selectedFloorId || !roomName) {
      setMsg('Please select a location, building, floor, and enter a room name');
      return;
    }

    setLoading(true);
    setMsg('Submitting Room...');
    try {
      const response = await fetch(`${Base_Url}/add-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: AuthApiKey,
          one: roomName,
          two: selectedFloorId,
          three: selectedBuildingId,
          four: selectedLocationId,
          five:'1'
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error('Failed to add room');

      if (result.message === 'room added successfully') {
        setMsg(`${roomName} room added successfully!`);
        setRoomName('');
        setSelectedLocationId('');
        setSelectedBuildingId('');
        setSelectedFloorId('');
      } else {
        setMsg('Failed to add room, please try again');
      }
    } catch (err) {
      setMsg('Failed to add room: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 10000);
    }
  };

  return (
    <div className="add-building-container">
     
      <p style={{color:"rgb(143 172 93)",fontSize:"22px",fontWeight:"500",marginBottom:"0px"}}>Add Area</p>

      {error && <p className="error">Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Location:</label>
        {loading ? (
          <p>Loading locations...</p>
        ) : (
          <select value={selectedLocationId} onChange={(e) => setSelectedLocationId(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.pec_loc_id} value={loc.pec_loc_id}>
                {loc.pec_loc_name}
              </option>
            ))}
          </select>
        )}

        <label>Building:</label>
        {loading ? (
          <p>Loading buildings...</p>
        ) : (
          <select value={selectedBuildingId} onChange={(e) => setSelectedBuildingId(e.target.value)}>
            <option value="">Select Building</option>
            {buildings.map((building) => (
              <option key={building.pec_build_id} value={building.pec_build_id}>
                {building.pec_build_name}
              </option>
            ))}
          </select>
        )}

        <label>Floor:</label>
        {loading ? (
          <p>Loading floors...</p>
        ) : (
          <select value={selectedFloorId} onChange={(e) => setSelectedFloorId(e.target.value)}>
            <option value="">Select Floor</option>
            {floors.map((floor) => (
              <option key={floor.pec_floor_id} value={floor.pec_floor_id}>
                {floor.pec_floor_number}
              </option>
            ))}
          </select>
        )}

        <label>Area Name:</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter Room Name"
        />

        <button type="submit" disabled={loading}>Add Area</button>
        {msg && <p className='ShowMsg'>{msg}</p>}
      </form>
    </div>
  );
};

export default AddRoom;
