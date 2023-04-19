const mongoose = require("./../db.js");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  completedDSAlgo: {
    type: [String],
  },
});

module.exports = mongoose.model("User", userSchema);
