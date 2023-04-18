const {
  createSession,
  getSession,
  destroySession,
} = require("../statelessSession");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(400)
        .send(JSON.stringify({ info: "!Unauthenticated. Token not found" }));
      // return res.redirect(400, '/login');
    }
    const existingSession = await getSession(token);
    if (!existingSession) {
      return res
        .status(400)
        .send(
          JSON.stringify({ info: "Unauthenticated. Session does not exist" })
        );
      // return res.redirect(400, '/login');
    }
    next();
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

module.exports = authMiddleware;
