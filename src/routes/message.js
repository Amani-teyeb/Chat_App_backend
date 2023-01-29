const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/message/:chatId").get(protect, allMessages);
router.route("/message").post(protect, sendMessage);

module.exports = router;
