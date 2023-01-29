const express = require("express");
const {
  signup,
  signin,
  signout,
  allUsers,
  getTeachers,
} = require("../controllers/auth");
const { protect } = require("../middleware/authMiddleware");
const router = express();
const User = require("../models/user");

router.post("/signin", signin);

router.post("/signup", signup);
router.post("/signout", signout);
// router.get('/getUsers', getUsers)
router.route("/getUsers").get(protect, allUsers);

module.exports = router;
