const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "default-devmode-key",
      (err, user) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Token is not valid", error: err });
        }

        // get User
        User.findById(user._id).then((user) => {
          if (!user) {
            return res
              .status(401)
              .json({ message: "Unauthorized! token expired." });
          }
          req.token = { user };
          next();
        });
      }
    );
  } catch (error) {
    return res.status(403).json({
      message: "Token is not valid",
      error: error.message,
    });
  }
}

module.exports = { authenticateToken };
