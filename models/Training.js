// models/Training.js
const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  t_u_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  t_trainings: String, // Assuming 'selectedSkills' is stored as stringified JSON
  // Other fields...
});

module.exports = mongoose.model("Training", trainingSchema);
