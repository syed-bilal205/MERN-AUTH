const router = require("express").Router();
const {
  loginUser,
  updateUserProfile,
  userProfile,
  registerUser,
  logoutUser,
} = require("../controllers/User");
const protect = require("../middleware/AuthMiddleaware");

// REGISTER ROUTE
router.post("/", registerUser);

// LOGIN ROUTE
router.post("/login", loginUser);

// LOGOUT ROUTE
router.post("/logout", logoutUser);

// USER PROFILE ROUTE
router.get("/profile", protect, userProfile);

// USER PROFILE UPDATED ROUTE
router.put("/profile", protect, updateUserProfile);

module.exports = router;
