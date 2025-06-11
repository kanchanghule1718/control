import React, { useState } from 'react';
import axios from 'axios';


const AddLocation = () => {
  const [location, setLocation] = useState('');
  const [msg, setMsg] = useState('');
  
const Base_Url = sessionStorage.getItem('BASEURL');
const AuthApiKey = sessionStorage.getItem('APIKEY');

  
  //const emId = sessionStorage.getItem("em_id"); // Retrieve from session

  // Handle input change
  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location.trim()) {
      setMsg("Location name is required.");
      return;
    }

    setMsg("Submitting Location...");

    try {
      const response = await axios.post(`${Base_Url}/add-location`, {
        apiKey: AuthApiKey,
        one: location,
        two: "1",
      },
      
    );

      console.log('Location',response.data)
      if((response.data.message === "location added successfully")){
        setMsg(`Location "${location}" added successfully!`);
        setLocation('')
      }

      else if (response.data.message === "location already exists") {
        setMsg(`Location "${location}"  already exists!`);
        setLocation(''); // Reset input field
      } else {
        setMsg("Failed to add location. Please try again.");
      }
    } catch (error) {
      console.error('Error during location submission:', error);
      setMsg(error.response?.data || "Error occurred. Please try again later.");
    }

    setTimeout(() => {
      setMsg('');
    }, 10000);
  };

  return (
    <div>
   
      <p style={{color:"rgb(143 172 93)",fontSize:"22px",fontWeight:"500",marginBottom:"0px"}}>Add Customer Location</p>
      <form onSubmit={handleSubmit}>
        <label>Customer Location:</label>
        <input 
          type="text" 
          name="location" 
          value={location} 
          onChange={handleInputChange} 
          placeholder="Enter Location Name"
        />
        <br />
        <button type="submit">Submit</button>
        {msg && <p className='ShowMsg'>{msg}</p>}
      </form>
      
    </div>
  );
};

export default AddLocation;
