const mongoose = require('mongoose')


const ideaSchema = new mongoose.Schema({
  idea: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  //role: { type: String, required: true }
});


const IdeaModel =mongoose.model("idea", ideaSchema, )
module.exports = IdeaModel