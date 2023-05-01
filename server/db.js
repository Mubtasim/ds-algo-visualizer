const mongoose = require("mongoose");
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "dsalgovisualizer";
const MONGO_URI = `mongodb://localhost:${DB_PORT}/${DB_NAME}`;

mongoose.connect(
  // `mongodb://localhost:${DB_PORT}/${DB_NAME}`,
  // `mongodb+srv://mubtasim91:@cluster0.0nlcx2l.mongodb.net/test`,
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
  // (err) => {
  //   if (err) {
  //     console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
  //   } else {
  //     console.log(`🦆 Database (JWT) connected @ port ${DB_PORT}!`); // eslint-disable-line no-console
  //   }
  // }
);

module.exports = mongoose;
