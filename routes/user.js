const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.post("/",checkAuth,UserController.user_allUsers)
router.get("/profile", checkAuth, UserController.user_profile);

module.exports = router;

