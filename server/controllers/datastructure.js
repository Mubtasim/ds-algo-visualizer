const bcrypt = require("bcrypt");
const DataStructure = require("../models/datastructure");

const getAllDsAlgo = async (req, res) => {
  try {
    const dsAndAlgos = await DataStructure.find({});
    res.status(200).send(JSON.stringify(dsAndAlgos));
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

module.exports = { getAllDsAlgo };
