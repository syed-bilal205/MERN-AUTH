const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN ROUTE
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //AFTER GETTING DATA FROM BODY WE SEE IF USE IS REGISTERED OR NOT
  const user = await User.findOne({ email });

  //   AFTER CHECKING USER IS REGISTERED OR NOT NOW COMPARING PASSWORD FOR LOGIN
  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ******************************************************************************/
// REGISTER ROUTE
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //AFTER GETTING DATA FROM BODY WE SEE IF USE IS ALREADY EXIST
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exist");
  }

  //   HASHED THE PASSWORD BEFORE CREATING
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //   AFTER CHECKING WE ARE KNOW CREATING USER
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    // WE ARE PROVIDING res COZ WE ARE SETTING COOKIE
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// ******************************************************************************/
// USER LOGOUT ROUTE
const logoutUser = asyncHandler(async (req, res) => {
  // DESTROYING COOKIE
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(201).json({ message: "User Logged out" });
});

// USER PROFILE ROUTE
const userProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  //   console.log(req.user);
  res.status(201).json(user);
});

// UPDATE USER PROFILE
const updateUserProfile = asyncHandler(async (req, res) => {
  // WE HAVE USER IN req.user BUT WE DON'T HAVE THE PASSWORD TO UPDATE SO WE DO THAT
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      // Hash the password before storing it in the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(401);
    throw new Error("user not found");
  }
});

// *******************************
// GENERATING TOKEN NOW AND ADD THE TOKEN WITH COOKIE
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  //   NOW ADDING JWT TOKEN INTO COOKIE
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: "development" !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
// *******************************

module.exports = {
  loginUser,
  registerUser,
  userProfile,
  updateUserProfile,
  logoutUser,
};
