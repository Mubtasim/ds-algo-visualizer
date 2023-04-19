const mongoose = require("./../db.js");

const dataStructureSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  subTitle: {
    type: String,
  },
  slug: {
    type: String,
  },
  tutorialText: {
    type: String,
  },
  tutorialVideoUrl: {
    type: String,
  },
});

module.exports = mongoose.model("DataStructure", dataStructureSchema);
