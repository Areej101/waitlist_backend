const { User } = require("../models");
const jwt = require("jsonwebtoken");

/*
    Register a new user
    POST /api/register
*/
async function RegisterUser(req, res) {
  const userData = req.body;
  try {

    // check if the user already exists with email or phone
    const user = await User.findOne({ email: userData.email });
    if(user) { return res.status(400).json({ message: "User already exists" }); }

    // Create a new user
    const newUser = new User(userData);
    await newUser.save();

    // send response
    res.json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

/*
    Login a user
    POST /api/login
*/
async function LoginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email, password });

    // If user is not found
    if (!user) { return res.status(400).json({ message: "Invalid email or password" }); }

    // create a JWT token
    const token = jwt.sign({ 
      _id: user._id,
      email: user.email,
      name: user.name,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // send response
    res.json({ 
        message: "User logged in successfully",
        token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { RegisterUser, LoginUser };
