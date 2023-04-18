const mongoose = require("./../db.js");

const blockedListSchema = mongoose.Schema({
  blockedToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BlockedList", blockedListSchema);
