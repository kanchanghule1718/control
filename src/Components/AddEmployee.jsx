import React, { useState } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pan, setPan] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');

  // Retrieve the BASEURL and APIKEY from sessionStorage
  const Base_Url = sessionStorage.getItem('BASEURL');
  const AuthApiKey = sessionStorage.getItem('APIKEY');

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setMobileError('');
    setMessage('');

    if (!validateMobile(mobile)) {
      setMobileError('Invalid mobile number. It should be exactly 10 digits.');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long, include one uppercase letter, one number, and one special character.');
      return;
    }

    const employeeData = {
      apiKey: AuthApiKey,
      one: "1", // Admin Id
      two: username, // Username
      three: password, // Password
      four: mobile, // Contact
      five: email, // Email Id
      six: address, // Address
      seven: null, // Pan
      eight: null, // Aadhar
      nine: "", // Image Path
      ten: "1", // Document Path
      eleven: "2" // Permission Id
    };

    try {
      await axios.post(`${Base_Url}/add-employee`, employeeData);
      setMessage('✅ Employee added successfully!');
      // Clear fields after successful submission
      setUsername('');
      setPassword('');
      setMobile('');
      setEmail('');
      setAddress('');
      setPan('');
      setAadhar('');
    } catch (error) {
      console.error('Error adding employee:', error.response ? error.response.data : error.message);
      setMessage('❌ Failed to add employee.');
    }
  };

  return (
    <div className="form-container">
    
      <p style={{color:"rgb(143 172 93)",fontSize:"22px",fontWeight:"500",marginBottom:"0px"}}>Employee Form</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {passwordError && <p style={{ color: 'red', fontSize: '14px' }}>{passwordError}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="mobile">Mobile:</label>
          <input type="text" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          {mobileError && <p style={{ color: 'red', fontSize: '14px' }}>{mobileError}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default AddEmployee;
