const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  createSession,
  getSession,
  destroySession,
} = require("../statelessSession");

const saltRounds = 10;

function trimAndLowerCase(txt) {
  txt = txt.trim();
  txt = txt.toLowerCase();
  return txt;
}

async function doesExist(email) {
  try {
    const query = await User.findOne({
      email,
    });
    if (query === null) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
}

async function checkCredentials(email, password) {
  try {
    if (!doesExist(email)) return false;
    return await User.findOne({
      email,
    }).then((query) => {
      if (query) return query;
      return false;
    });
  } catch (error) {
    console.log(error);
  }
}

const create = async (req, res) => {
  try {
    let { email, password, fullName } = req.body;
    const hashedPassword = await bcrypt
      .hash(password, saltRounds)
      .then(function (hash) {
        return hash;
      });
    email = trimAndLowerCase(email);
    if (await doesExist(email)) {
      res.status(401).send("email already exists!");
      return;
    }
    const user = await new User({
      email,
      password: hashedPassword,
      fullName,
    });
    let unknownError = "";
    await user.save();
    res
      .status(200)
      .send(JSON.stringify({ email: user.email, fullName: user.fullName }));
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = trimAndLowerCase(email);
    if (!(email && password)) {
      return res.status(400).send("Missing credentials");
    }
    const user = await checkCredentials(email, password);
    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const token = createSession(email);

    res.cookie("accessToken", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Strict",
    });
    const data = {
      email: user.email,
      fullName: user.fullName,
      completedDSAlgo: user.completedDSAlgo,
    };
    res.status(200).send(JSON.stringify({ accessToken: token, data: data }));
    // res.redirect(200, '/')
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const profile = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const session = await getSession(token);
    const userEmail = session.userEmail;
    const profile = await User.findOne({
      email: userEmail,
    });
    const { email, fullName } = profile;
    res.status(200).send(JSON.stringify({ email, fullName }));
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!destroySession(token)) {
      return res.status(400).send("No session to logout.");
    }
    res.status(200).send(JSON.stringify({ info: "logged out" }));
  } catch (error) {
    res.sendStats(500);
    console.log(error);
  }
};

const markComplete = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const dsId = req.params.id;
    const session = await getSession(token);
    const userEmail = session.userEmail;
    const profile = await User.findOne({
      email: userEmail,
    });
    // console.log(profile, dsId);
    const dsIdIdx = profile.completedDSAlgo.indexOf(dsId);
    if (dsIdIdx === -1) {
      profile.completedDSAlgo.push(dsId);
      await profile.save();
    }
    res
      .status(200)
      .send(JSON.stringify({ completedDSAlgo: profile.completedDSAlgo }));
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

const markIncomplete = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const dsId = req.params.id;
    const session = await getSession(token);
    const userEmail = session.userEmail;
    const profile = await User.findOne({
      email: userEmail,
    });
    // console.log(profile, dsId);
    const dsIdIdx = profile.completedDSAlgo.indexOf(dsId);
    if (dsIdIdx > -1) {
      profile.completedDSAlgo.splice(dsIdIdx, 1);
      await profile.save();
    }
    res
      .status(200)
      .send(JSON.stringify({ completedDSAlgo: profile.completedDSAlgo }));
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

module.exports = {
  create,
  login,
  profile,
  logout,
  markComplete,
  markIncomplete,
};
