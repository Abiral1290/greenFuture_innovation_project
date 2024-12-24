import '../css/LoginPage.css'; // Create a CSS file for styling
import { useNavigate } from 'react-router-dom'; 
import AlertDialog from '../ui/constant/alertDialog';

// LoginPage.js
import React, { useState, useEffect } from 'react';  // <-- Add useEffect import here
import { MY_Email } from './constant/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  

  const handleCloseAlert = () => {
    setAlertMessage(false); // Close the alert dialog
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return; // Prevent multiple submissions
  
    setIsSubmitting(true); // Set submitting state
  
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {


       // alert('Login SucessFully' );
        setAlertMessage('Login SucessFully');
        localStorage.setItem('userEmail', email)
        // Handle successful login (e.g., store token in localStorage)
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token); // Save JWT in localStorage
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        // Handle login error
        alert(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    //  alert('Login failed. Please try again later.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };
  

  useEffect(() => {
    // Example: If user is already logged in, you can redirect them
    // For example, if the user is logged in, you can redirect directly to the home page:
    // const loggedIn = checkIfLoggedIn(); // some condition
    // if (loggedIn) navigate('/home');
  }, [navigate]); // UseEffect to handle any side effects (like initial redirects)

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="login-btn">Login</button>
      </form>
      <button onClick={() => navigate('/signup')} className="signup-btn">Sign Up</button>
      {alertMessage && (
        <AlertDialog message={alertMessage} onClose={handleCloseAlert} />
      )}
    </div>
  );
};

export default LoginPage;
