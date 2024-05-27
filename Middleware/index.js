// import middleware
const { authenticateToken } = require("./auth.middleware");

// export middleware
module.exports = { authenticateToken };