// models/Mentoring.js
const mongoose = require("mongoose");

const mentoringSchema = new mongoose.Schema({
  m_name: String,
  m_email: String,
  m_phone: String,
  m_enquiry: String,
  m_file: Buffer,
  m_u_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Other fields...
});

module.exports = mongoose.model("Mentoring", mentoringSchema);
