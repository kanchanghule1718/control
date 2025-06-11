import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const ReasonModal = ({ show, onClose, roomId }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');
  const em_id = sessionStorage.getItem('em_id'); // Correct key is 'em_id'

  const handleSave = async () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear any previous success message 

    try {
     // const response = await axios.post(`http://localhost:5000/add-room-desc`, {
           const response = await axios.post(`${Base_Url}/add-room-desc`, {
        apiKey: `${AuthApiKey}`,
        one: reason,
        two: roomId,
        three: em_id,
      });

      if (response.data.success) {
        setSuccessMessage('Room pending reason added successfully');
        setTimeout(() => {
          setSuccessMessage(''); // Clear success message
          onClose(); // Close modal after 5 seconds
        }, 5000); // Close modal after 5 seconds
      } else {
        setError('Failed to submit reason');
      }

      setReason('');
    } catch (err) {
      setError('Failed to submit reason');
    }

    setLoading(false);
  };

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document" style={{ marginTop: '120px', width: '90%' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ color: 'green' }}>
              Please Provide a Reason
            </h5>
            <button type="button" className="btn-close" style={{ width: '30px' }} onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              placeholder="Enter reason..."
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
           
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
           
          </div>
          {error && <p style={{ color: 'red', marginTop: '8px',textAlign:"center" }}>{error}</p>}
          {successMessage && <p style={{ color: 'green', marginTop: '8px',textAlign:"center" }}>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
