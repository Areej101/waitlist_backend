const express = require("express");
const router = express.Router();


// Import controllers
const { RegisterUser, GetUsers } = require("../controllers");

// Setup routes
router.post("/wait-list/register", RegisterUser);   // REGISTER USER
router.get("/wait-list/users", GetUsers);  // GET ALL USERS

module.exports = router;