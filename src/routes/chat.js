const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express();

router.route("/chat").post(protect, accessChat);
router.route("/chat").get(protect, fetchChats);
router.route("/chat/group").post(protect, createGroupChat);
router.route("/chat/rename").put(protect, renameGroup);
router.route("/chat/groupadd").put(protect, addToGroup);
router.route("/chat/groupremove").put(protect, removeFromGroup);

module.exports = router;
