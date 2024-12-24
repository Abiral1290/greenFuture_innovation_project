import React, { useState, useEffect } from 'react';
import '../css/Ideas.css';
import axios from 'axios';
import AlertDialog from '../ui/constant/alertDialog';


const IdeasConfirm = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emails = localStorage.getItem('userEmail');
  const [alertMessage, setAlertMessage] = useState(null);


  // Fetch ideas from the API
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3001/confirmidea');
        if (!response.ok) {
          throw new Error('Failed to fetch ideas');
        }
        const data = await response.json();
        setIdeas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Handle idea confirmation
  const handleConfirm = async (e, ideaId) => {
    e.preventDefault(); // This prevents the default behavior of the event
  
    setIsSubmitting(true); // Start submission state


    console.log(localStorage.getItem('userEmail'));
    try {
      // Make sure to use the correct `ideaId` here
      const response = await axios.post('http://localhost:3001/confirmidea', {
        idea: ideas.find((idea) => idea._id === ideaId)?.idea, // Find the idea using its ID
        email: "cdfsdfs@gmail.com",
      });
      setMessage('Idea submitted successfully!');
      setAlertMessage('Idea submitted successfully!');
      console.log('Response received:', response); // Debug log for response
  
      if (response.status === 201) {
        const data = response.data;
        setMessage(`Idea submitted successfully! ID: ${data._id}`);
      } else {
        setAlertMessage('Error submitting idea.');
        setMessage('Error submitting idea.');
        throw new Error('Failed to submit idea');
      }
    } catch (error) {
      setAlertMessage('Error submitting idea.');
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
  
  

 

  if (loading) return <div>Loading ideas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ideas-container">
      <h2>Submitted Ideas</h2>
      {ideas.length === 0 ? (
        <p>No ideas found</p>
      ) : (
        <div className="ideas-list">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-card">
              <div className="idea-content">
                <p><strong>Idea:</strong> {idea.idea}</p>
                <p><strong>Submitted By:</strong> {idea.email}</p>
                <p><small>Submitted At: {new Date(idea.createdAt).toLocaleString()}</small></p>
              </div>
              <div className="idea-buttons">
                <button
                  className="confirm-btn"
                  onClick={(e) => handleConfirm(e,idea._id)}
                  disabled={isSubmitting}
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
           {alertMessage && (
        <AlertDialog message={alertMessage} onClose={handleCloseAlert} />
      )}
        </div>
      )}
    </div>
  );
};

export default Ideas;
