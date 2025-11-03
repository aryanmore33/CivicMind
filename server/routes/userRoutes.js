const express = require("express");
const { registerUser, loginUser } = require("../controllers/userControllers");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.json({ success: true, message: "User routes working ✅" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
