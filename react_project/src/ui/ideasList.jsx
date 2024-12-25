import React, { useState, useEffect } from 'react';
import '../css/Ideas.css';
import axios from 'axios';
import AlertDialog from '../ui/constant/alertDialog';


const Ideas = () => {
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
        const response = await fetch('http://localhost:3001/ideas');
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
        email: ideas.find((idea) => idea._id === ideaId)?.email,
      });
       handleConfirmStatus(ideas.find((idea) => idea._id === ideaId)?._id);
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
  
  
  const handleCloseAlert = () => {
    setAlertMessage(null);
  };
  

  const handleConfirmStatus = async (ideaId) => {
    setIsSubmitting(true); // Start submitting state

    console.log("idea Status id", ideaId)
    try {
      const response = await axios.patch(`http://localhost:3001/ideas/${ideaId}`, {
        ideaConfirmStatus: true, // Set ideaConfirmStatus to true
      });

      if (response.status === 200) {
        
      }
    } catch (error) {
      setAlertMessage('Error confirming idea');
      console.error('Error confirming idea:', error);
    } finally {
      setIsSubmitting(false); // End submitting state
    }
  };
  
  // Handle idea deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      console.log(id);
      try {
        const response = await fetch(`http://localhost:3001/ideas/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete the idea');
        }
        setIdeas(ideas.filter((idea) => idea._id !== id)); // Update the state
        alert('Idea deleted successfully!');
      } catch (err) {
        setError(err.message);
      }
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
              {idea.ideaConfirmStatus !== true && (
                 <div className="idea-buttons">
                 <button
                   className="confirm-btn"
                   onClick={(e) => handleConfirm(e,idea._id)}
                   disabled={isSubmitting}
                 >
                   Confirm
                 </button>
               <button
                 className="delete-btn"
                 onClick={() => handleDelete(idea._id)}
               >
                 Delete
               </button>
             
 
               </div>
              )}
             
            </div>
          ))}
           {alertMessage && (
        <AlertDialog message=
        {alertMessage} onClose={handleCloseAlert} />
      )}
        </div>
      )}
    </div>
  );
};

export default Ideas;
