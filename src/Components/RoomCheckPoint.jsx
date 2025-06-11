import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomCheckpoint.css';
import ReasonModal from './ReasonModal';



const RoomCheckPoint = () => {
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [locations, setLocations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [products, setProducts] = useState([]);
  const [treatments, setTreatments] = useState({});
  const [checkedRooms, setCheckedRooms] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [findings, setFindings] = useState({});
  const [remarks, setRemarks] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

const handleOpenReasonModal = (roomId) => {
  setSelectedRoomId(roomId);
  setShowModal(true);
};

const handleCloseReasonModal = () => {
  setShowModal(false);
  setSelectedRoomId(null);
};

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');
  const em_id = sessionStorage.getItem('em_id'); // Correct key is 'em_id'


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.post(`${Base_Url}/get-all-locations`, { apiKey: AuthApiKey });
        if (response.data.success) setLocations(response.data.locations);
      } catch (error) {
        setError('Failed to fetch locations');
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!location) return;
    const fetchBuildings = async () => {
      try {
        const response = await axios.post(`${Base_Url}/get-buildingbyid`, { apiKey: AuthApiKey, one: location });
        setBuildings(response.data.success ? response.data.buildings : []);
      } catch (error) {
        setError('Failed to fetch buildings');
        
      }
    };
    fetchBuildings();
  }, [location]);

  useEffect(() => {
    if (!building) return;
    const fetchFloors = async () => {
      try {
        const response = await axios.post(`${Base_Url}/get-floorsbyid`, { apiKey: AuthApiKey, one: building });
        setFloors(response.data.success ? response.data.floors : []);
      } catch (error) {
        setError('Failed to fetch floors');
       
      }
    };
    fetchFloors();
  }, [building]);

  useEffect(() => {
    if (!floor) return;
    const fetchRooms = async () => {
      try {
        const response = await axios.post(`${Base_Url}/get-rooms-byfloorid`, { apiKey: AuthApiKey, one: floor });
        // const response = await axios.post(`http://localhost:5000/get-rooms-byfloorid`, { apiKey: AuthApiKey, one: floor });

        setRooms(response.data.success ? response.data.rooms : []);
      } catch (error) {
        setError('Failed to fetch rooms');
      
      }
    };
    fetchRooms();
  }, [floor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const selectedTreatments = Object.values(treatments).filter(Boolean);
    const selectedRooms = Object.keys(checkedRooms).filter(roomId => checkedRooms[roomId]);
    const selectedFindings = selectedRooms.map(roomId => findings[roomId] || '').join(',');
    const selectedRemarks = selectedRooms.map(roomId => remarks[roomId] || '').join(',');
    const selectedTreatmentsStr = selectedRooms.map(roomId => treatments[roomId] || '').join(',');
    const selectedproductStr = selectedRooms.map(roomId => products[roomId] || '').join(',');

    if (selectedTreatments.length === 0 || selectedRooms.length === 0) {
      setError('At least select treatment and check a room.');
      setTimeout(() => setError(''), 8000); // Clear success after 5 seconds
      return;
    }

    // const roomDetails = selectedRooms.map(roomId => ({
    //   roomId,
    //   treatment: treatments[roomId] || '',
    //   finding: findings[roomId] || '',
    //   remark: remarks[roomId] || ''
    // }));
    // //  and pass roomDetails to one    
    try {
      //const response = await axios.post(`http://localhost:5000/add-roomCheckpoint-details`, {
      const response = await axios.post(`${Base_Url}/add-roomCheckpoint-details`, {
        apiKey: AuthApiKey,
        one: selectedTreatmentsStr,
        two: selectedRooms.join(','),
        three: floor,
        four: building,
        five: location,
        six: em_id,
        seven: selectedFindings,
        eight: selectedRemarks,
        nine: selectedproductStr

      });

      if (response.data.success) {
        setSuccess('Pest control done successfully.');
        setTimeout(() => setSuccess(''), 5000); // Clear success after 5 seconds
      } else {
        setError('Failed to submit details.');
        setTimeout(() => setError(''), 8000); // Clear success after 5 seconds
      }
    } catch (error) {
      setError('Error submitting details.');
      setTimeout(() => setError(''), 8000); // Clear success after 5 seconds
    }
  };
 
  
  return (
    <div className="room-checkpoint-container" style={{ width: "100%" }}>
      <h1 style={{ color: "rgb(143 172 93)", fontSize: "22px", fontWeight: "500", marginBottom: "0px" }}>Area Check Point</h1>
      {/* {error && <p className="error-message">{error}</p>} */}
      {/* {success && <p className="success-message">{success}</p>} */}
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "1000px" }}>
        <label>Location:</label>
        <select value={location} onChange={(e) => {
          setLocation(e.target.value);
          setBuilding('');  // Reset building when location changes
          setFloor('');     // Reset floor when location changes
          setRooms('');
        }}>
          <option value="">Select Location</option>
          {locations.map(loc => (
            <option key={loc.pec_loc_id} value={loc.pec_loc_id}>{loc.pec_loc_name}</option>
          ))}
        </select>

        <label>Building:</label>
        <select value={building} onChange={(e) => {
          setBuilding(e.target.value);
          setFloor('');     // Reset floor when location changes
          setRooms('');
        }}>
          <option value="">Select Building</option>
          {buildings.map(bld => (
            <option key={bld.pec_build_id} value={bld.pec_build_id}>{bld.pec_build_name}</option>
          ))}
        </select>

        <label>Floor:</label>
        <select value={floor} onChange={(e) => { setFloor(e.target.value) }}>
          <option value="">Select Floor</option>
          {floors.map(flr => (
            <option key={flr.pec_floor_id} value={flr.pec_floor_id}>{flr.pec_floor_number}</option>
          ))}
        </select>

        {rooms.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Area Name</th>
                <th>Pest Product</th>
                <th>Mode Of Treatment</th>
                <th>Pestcontrol</th>
                <th>Remarks</th>
                <th>Check</th>
                <th>Add Reason</th>

              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.pec_rm_id}>
                  <td>{room.pec_rm_name}</td>
                  <td>
                    {room.pec_rm_status === 'completed' ? (
                      <span>{products[room.pec_rm_id] || room.pec_rmde_pest_product}</span>
                    ) : (
                      <select
                        onChange={(e) => setProducts({ ...products, [room.pec_rm_id]: e.target.value })}
                        value={products[room.pec_rm_id] || room.pec_rmde_pest_product} // Default value if not selected
                      >
                        <option value="">Select Pest Product</option>
                        <option value="Cockroach">Cockroach</option>
                        <option value="Mosquito">Mosquito</option>
                        <option value="Bed Bugs">Bed Bugs</option>
                        <option value="Ants">Ants</option>
                        <option value="Termites">Termites</option>
                        {/* You can add more products here if needed */}
                      </select>
                    )}
                  </td>


                  <td>
                    {room.pec_rm_status === 'completed' ? (
                      <span>{treatments[room.pec_rm_id] || room.pec_rmde_desc}</span>
                    ) : (
                      <select
                        onChange={(e) => setTreatments({ ...treatments, [room.pec_rm_id]: e.target.value })}
                        value={treatments[room.pec_rm_id] || ''}
                      >
                        <option value="">Select Treatment</option>
                        {products[room.pec_rm_id] === 'Mosquito' && (
                          <>
                            <option value="Fogging">Fogging</option>
                            <option value="Residual Spray">Residual Spray</option>
                            <option value="Larvicidal Treatment">Larvicidal Treatment</option>
                          </>
                        )}
                        {products[room.pec_rm_id] === 'Cockroach' && (
                          <>
                            <option value="Gel Baiting">Gel Baiting</option>
                            <option value="Residual Spray">Residual Spray</option>
                          </>
                        )}
                        {products[room.pec_rm_id] === 'Bed Bugs' && (
                          <>
                            <option value="Steam Treatment">Steam Treatment</option>
                            <option value="Insecticidal Spray">Insecticidal Spray</option>
                          </>
                        )}
                        {products[room.pec_rm_id] === 'Ants' && (
                          <>
                            <option value="Baiting">Baiting</option>
                            <option value="Spraying">Spraying</option>
                          </>
                        )}
                        {products[room.pec_rm_id] === 'Termites' && (
                          <>
                            <option value="Pre-Construction">Pre-Construction</option>
                            <option value="Post-Construction">Post-Construction</option>
                          </>
                        )}
                        {products[room.pec_rm_id] === 'Rodenticides' && (
                          <>
                            <option value="Trapping">Trapping</option>
                            <option value="Bait Station">Bait Station</option>
                          </>
                        )}
                        {/* Default fallback */}
                        {(!products[room.pec_rm_id] || products[room.pec_rm_id] === '') && (
                          <>
                            <option value="Liquid Treatment">Liquid Treatment</option>
                            <option value="Bed Bug">Bed Bug</option>
                            <option value="Gel Treatment">Gel Treatment</option>
                          </>
                        )}
                      </select>
                    )}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={
                        room.pec_rm_status === 'completed'
                          ? room.pec_rmde_findings || ''
                          : findings[room.pec_rm_id] || ''
                      }

                      onChange={(e) => setFindings({ ...findings, [room.pec_rm_id]: e.target.value })}
                      disabled={room.pec_rm_status === 'completed'}
                    />
                  </td>
                  <td style={{ padding: "auto" }}>
                    <input
                      type="text"

                      value={
                        room.pec_rm_status === 'completed'
                          ? room.pec_rmde_treatment || ''
                          : remarks[room.pec_rm_id] || ''
                      }

                      onChange={(e) => setRemarks({ ...remarks, [room.pec_rm_id]: e.target.value })}
                      disabled={room.pec_rm_status === 'completed'}
                    />
                  </td>

                  <td>
                    {room.pec_rm_status === 'completed' ? (
                      <input type="checkbox" checked disabled style={{ marginLeft: "5%", width: '12px', height: '12px',cursor:"pointer" }} />
                    ) : (
                      <input
                        type="checkbox"

                        onChange={(e) =>
                          setCheckedRooms({ ...checkedRooms, [room.pec_rm_id]: e.target.checked })
                        }
                        style={{ marginLeft: "25%", width: '16px', height: '16px',cursor:"pointer" }}
                      />
                    )}
                  </td>
                  <td>
  {room.pec_rm_status !== 'completed' ? (
    <i
      className="bi bi-plus-circle-fill"
      style={{ color: 'green', fontSize: '28px', cursor: 'pointer' }}
      onClick={() => handleOpenReasonModal(room.pec_rm_id)}  // Open modal with room ID
    ></i>
  ) : (
    <i
      className="bi bi-plus-circle-fill"
      style={{ color: 'gray', fontSize: '28px', cursor: 'not-allowed' }}
    ></i>
  )}
</td>




                </tr>
              ))}
            </tbody>
          </table>
        )}


        <button type="submit" style={{ maxWidth: "400px" }}>Submit</button>
        {error && <p style={{ fontSize: "15px", color: "red" ,textAlign:"center"}}>{error}</p>}
        {success && <p style={{ fontSize: "15px", color: "green",textAlign:"center" }}>{success}</p>}
      </form>

      {showModal && <ReasonModal show={showModal} onClose={() => setShowModal(false)}  roomId={selectedRoomId}/>}
    </div>
    
  );
};

export default RoomCheckPoint;
