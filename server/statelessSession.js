const jwt = require("jsonwebtoken");

const BlockedList = require("./models/blockedList");

const SUPER_SECRET_KEY = "PLZ_DONT_READ_ME_123";
// const blokcedList = []; // <-- not stateless

const createSession = (userEmail) => {
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1);

  const newSession = {
    // no sessionId needed as session data is stored in token
    expiresAt: expiry.valueOf(),
    userEmail: userEmail,
  };

  return jwt.sign(newSession, SUPER_SECRET_KEY);
};

const getSession = (token) => {
  // if (blokcedList.includes(token)) return undefined;
  return BlockedList.findOne({ blockedToken: token })
    .then((query) => {
      if (query) {
        console.log("token blocked");
        return undefined;
      }
      const sessionData = jwt.verify(token, SUPER_SECRET_KEY);

      if (sessionData.expiry < Date.now()) {
        console.log("Token has expired.");
        return undefined;
      }

      return sessionData;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });
};

const destroySession = (token) => {
  // blokcedList.push(token);
  return new BlockedList({
    blockedToken: token,
  })
    .save()
    .then((e) => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

module.exports = { createSession, getSession, destroySession };
