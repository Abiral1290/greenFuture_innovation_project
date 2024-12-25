import React, { useState, useEffect } from 'react';
import '../css/IdeasConfirm.css';
import axios from 'axios';
import AlertDialog from '../ui/constant/alertDialog';

const IdeasConfirm = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Fetch ideas from the API
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

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Handle vote confirmation
  const handleVote = async (e, idea) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('my id', idea._id)

    try {
      const response = await axios.patch(`http://localhost:3001/confirmidea/${idea._id}`, {
        voteIncrement: 1, // Increment the vote count by 1
      });
      if (response.status === 200) {
        handleVoteStatus(idea_id)
        setSelectedIdea(idea); // Set the selected idea for the alert dialog
        setAlertMessage('Vote recorded successfully!');
        // Refresh the idea list to update vote counts
        fetchIdeas();
      } else {
        throw new Error('Failed to update vote');
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      setAlertMessage('Error updating vote.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleVoteStatus = async (ideaId) => {
    setIsSubmitting(true); // Start submitting state

    console.log("idea Status id", ideaId)
    try {
      const response = await axios.patch(`http://localhost:3001/register/${ideaId}`, {
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

  const handleCloseAlert = () => {
    setAlertMessage(null);
    setSelectedIdea(null);
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
                  className="vote-btn"
                  onClick={(e) => handleVote(e, idea)}
                  disabled={isSubmitting}
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {alertMessage && selectedIdea && (
        <AlertDialog
          message={
            <div>
              <p><strong>{alertMessage}</strong></p>
              <p><strong>Idea:</strong> {selectedIdea.idea}</p>
              <p><strong>Submitted By:</strong> {selectedIdea.email}</p>
              <p><small>Submitted At: {new Date(selectedIdea.createdAt).toLocaleString()}</small></p>
            </div>
          }
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default IdeasConfirm;
