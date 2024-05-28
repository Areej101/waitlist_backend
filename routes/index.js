const express = require("express");
const router = express.Router();


// Import controllers
const { RegisterUser, GetUsers, UpdateWaitListFlag, GetWaitListFlag } = require("../controllers");

// Users routes
router.post("/wait-list/register", RegisterUser);   // REGISTER USER
router.get("/wait-list/users", GetUsers);  // GET ALL USERS

// Flag routes
router.post("/wait-list/flag", UpdateWaitListFlag);  // UPDATE FLAG
router.get("/wait-list/flag", GetWaitListFlag);  // GET FLAG


module.exports = router;