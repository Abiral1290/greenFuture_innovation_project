const mongoose = require('mongoose')


const ideaConfirmSchema = new mongoose.Schema({
    idea: { type: String, required: true },
    submittedBy: { type: String, required: true, unique: true },
    vote: { type: int,  },
 
  });
  
  const IdeaConfirm =mongoose.model('Idea', ideaConfirmSchema);
  module.exports = IdeaConfirm