const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../Middleware");

const multer = require('multer'); // For handling file uploads

// Configure the upload storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controllers
const { RegisterUser, LoginUser, CreateBlog, GetAllBlogs, GetBlogById, UpdateBlog, DeleteBlog, GetUserBlogs, StarBlog } = require("../controllers");

// User routes
router.post("/register", RegisterUser); // Register a new user
router.post("/login", LoginUser); // Login a user

// blog routes
router.post("/blogs", authenticateToken, upload.single('file'), CreateBlog); // Create a new blog
router.get("/blogs", GetAllBlogs); // Get all blogs
router.get("/blogs/user", authenticateToken, GetUserBlogs); // Get all blogs of the user
router.get("/blogs/:id", GetBlogById); // Get blog by id
router.put("/blogs/:id", authenticateToken, upload.single('file'), UpdateBlog); // Update blog by id
router.delete("/blogs/:id", authenticateToken, DeleteBlog); // Delete blog by id
router.post("/blogs/:id/star", authenticateToken, StarBlog); // Star rating to the blog


module.exports = router;