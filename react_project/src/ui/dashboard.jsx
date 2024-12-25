import React, { useState } from 'react';
import '../css/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom Modal Component
const AlertDialog = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Success</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false); // Initialize showModal correctly
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const emails = localStorage.getItem('userEmail');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('form submitted')
  //   setIsSubmitting(true);

  //   if (!emails) {
  //     console.error("Email");
  //     setMessage("Email are required.");
  //     return;
  //   }else if(!inputValue){
  //     console.error("Idea is missing!");
  //   }

  // try {
  //   const response = await fetch('http://localhost:3001/ideas', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       idea: inputValue,  
  //       email: emails}), // Ensure correct data is sent
  //   });

  //   console.log('Response received:', response); // Debug log for response
  //   if (!response.ok) {
  //     throw new Error('Failed to submit idea');
  //   }

  //   const data = await response.json();
  //   alert('Signup failed: ' + (err.response ? err.response.data.message : 'Unexpected error'));
  //   setMessage(`Idea submitted successfully! ID: ${data._id}`);
  // } catch (error) {
  //   console.error('Error submitting idea:', error);
  //   setMessage(`Error: ${error.message}`);
  //   alert('Signup failed: ' + (err.response ? err.response.data.message : 'Unexpected error'));

  // } finally {
  //   setIsSubmitting(false);
  // }
  // };


 

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); // Start submission state
   
  try {

    const response = await axios.post('http://localhost:3001/ideas', {
      idea: inputValue,  // Ensure correct data is sent
      email: emails,
      ideaConfirmStatus: false
    });

    console.log('Response received:', response); // Debug log for response

    if (response.status === 201) {
      alert('Idea submitted successfully!');
      const data = response.data;
      setMessage(`Idea submitted successfully! ID: ${data._id}`);
    } else {
      throw new Error('Failed to submit idea');
    }
  } catch (error) {
    console.error('Error submitting idea:', error);

    const errorMessage = error.response
      ? error.response.data.message || 'Unexpected error'
      : error.message;

    alert('Signup failed: ' + errorMessage);
    setMessage(`Error: ${errorMessage}`);
  } finally {
    setIsSubmitting(false); // End submission state
  }
};



  const handleIdeaNavigation = () => {
    // Logic for logging out, for now, we'll just log to the console
    navigate('/ideasList'); // Navigate to login page
    console.log('Idea');
  };


  const handleIdeaNavigationVoteOnIdeas = () => {
    // Logic for logging out, for now, we'll just log to the console
    navigate('/ideasConfirmedList'); // Navigate to login page
    console.log('Idea');
  };

  const handleLogout = () => {
    // Logic for logging out, for now, we'll just log to the console
    navigate('/'); // Navigate to login page
    localStorage.removeItem('userEmail');
    console.log('User logged out');
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal when user clicks "Close"
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <div className="navbar">
        <h3 className="navbar-title">Dashboard</h3>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <button className="Ideas" onClick={handleIdeaNavigation}>Confirm Ideas</button>
        <button className="IdeasConfirm" onClick={handleIdeaNavigationVoteOnIdeas}>Ideas to Vote</button>

      </div>

      <div className="form-container">
        <h2>Submit Your Idea</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="inputField">Enter your idea:</label>
            <input
              type="text"
              id="inputField"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      {/* Render the custom AlertDialog if showModal is true */}
      {showModal && (
        <AlertDialog message={modalMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Dashboard;
