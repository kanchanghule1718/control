import React, { useState } from 'react'
import './Login.css'
import logo from "../assets/pecopp-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for username, password, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // const Base_Url = 'http://localhost:5000';
   const Base_Url = sessionStorage.getItem('BASEURL');
const AuthApiKey = sessionStorage.getItem('APIKEY');

  // Handle username change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // API URL and payload (you can replace this with your actual login API URL and request body)
    const loginUrl = `${Base_Url}/employee-login`; // Replace with your actual login API URL

    const payload = {
      apiKey: AuthApiKey,
      one: username,
      two: password,
    };

    try {
      const response = await axios.post(loginUrl, payload);
      
      // Check if the login is successful
      console.log(response.data.success);
      
      if (response.data.success) {
        setErrorMessage('Login successfully!');
        sessionStorage.setItem('em_id', response.data.em_id);
        sessionStorage.setItem('em_name', response.data.p_em_uname);

        if (response.data.em_permissionid === 1) {
          
          navigate('/admin'); // Redirect to admin dashboard
        }
        else if(response.data.em_permissionid===2){
          
          navigate('/technical'); // Redirect to admin dashboard
        }
        else if(response.data.em_permissionid===3){
          navigate('/Customer'); // Redirect to Customer dashboard
        }
        else{
          setErrorMessage('Something went wrong.');
        }
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      // Handle error, e.g., network issues
      console.error('Login failed:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="PECOPP Logo" className="logo" />
        <h2 style={{ color: "#FFC300" }}>Login</h2>
        
       
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-field">
              <span className="icon">
                <i className="fa fa-user"></i> {/* Font Awesome user icon */}
              </span>
              <input 
                type="text" 
                className="input1" 
                placeholder="Enter your username" 
                value={username} 
                onChange={handleUsernameChange} 
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ marginTop: "10px" }}>Password</label>
            <div className="input-field">
              <span className="icon">
                <i className="fa fa-lock"></i> {/* Font Awesome lock icon */}
              </span>
              <input 
                type="password" 
                className="input1" 
                placeholder="Enter your password" 
                value={password} 
                onChange={handlePasswordChange} 
              />
            </div>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <button className="custom-btn" type="submit">
            LOGIN
          </button>
        </form>
         {/* Show error message if login fails */}
         {errorMessage && <p style={{ color: 'red',marginTop:"8px" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
