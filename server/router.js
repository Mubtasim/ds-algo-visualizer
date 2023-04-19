const router = require("express").Router();
const userController = require("./controllers/user");
const dsController = require("./controllers/datastructure");
const authMiddleware = require("./middlewares/auth");

// add the paths for register, login, me, and logout here
router.post("/register", userController.create);
router.post("/login", userController.login);
router.get("/me", authMiddleware, userController.profile);
router.get("/logout", authMiddleware, userController.logout);
router.get("/markcomplete/:id", authMiddleware, userController.markComplete);
router.get(
  "/markincomplete/:id",
  authMiddleware,
  userController.markIncomplete
);

router.get("/getalldsalgo", dsController.getAllDsAlgo);

module.exports = router;
