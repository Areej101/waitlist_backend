const { Blog } = require("../models");

/*
    CREATE A NEW BLOG
    POST /api/blogs
*/
async function CreateBlog(req, res) {
  // collect the data from the request
  const { user } = req.token;
  const blogData = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: "Image required" });
  }

  // get extension of file
  const fileExtension = image.originalname.split(".").pop();

  // // file type should be image
  if (
    fileExtension !== "png" &&
    fileExtension !== "jpg" &&
    fileExtension !== "jpeg"
  ) {
    return res
      .status(400)
      .json({ message: "File type should be png, jpg, or jpeg" });
  }

  // // get file size in MB
  const fileSizeInMB = image.size / (1024 * 1024);
  if (fileSizeInMB > 5) {
    return res
      .status(400)
      .json({ message: "profile size should not be more than 5MB" });
  }

  try {
    // create a new blog
    const newBlog = new Blog({
      ...blogData,
      image: image && image.buffer.toString("base64"),
      user: user._id,
    });

    // save the blog
    await newBlog.save();

    // send the response
    return res.status(201).json({ message: "Blog created", newBlog });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/*
    GET ALL BLOGS
    GET /api/blogs
*/
async function GetAllBlogs(req, res) {
  try {
    // get all blogs
    const blogs = await Blog.find().populate("user", "name email");

    // send the response
    return res.status(200).json({ 
      message: "Blogs fetched successfully!",
      data: blogs
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/*
    GET BLOG BY ID
    GET /api/blogs/:id
*/
async function GetBlogById(req, res) {
  try {
    // get blog by id
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // send the response
    return res.status(200).json({ 
      message: "Blog fetched successfully!",
      data: blog 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/*
    UPDATE BLOG
    PUT /api/blogs/:id
*/
async function UpdateBlog(req, res) {
  // collect the data
  const { user } = req.token;
  const blogId = req.params.id;
  const blogData = req.body;
  const image = req.file;

  try {
    // check if blog exists with the user
    const blog = await Blog.findOne({ _id: blogId, user: user._id }).populate(
      "user",
      "name email"
    );
    if (!blog) {
      return res.status(400).json({ message: "Blog not found" });
    }

    if (image) {
      // get extension of file
      const fileExtension = image.originalname.split(".").pop();

      // file type should be image
      if (
        fileExtension !== "png" &&
        fileExtension !== "jpg" &&
        fileExtension !== "jpeg"
      ) {
        return res
          .status(400)
          .json({ message: "File type should be png, jpg, or jpeg" });
      }

      // get file size in MB
      const fileSizeInMB = image.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        return res
          .status(400)
          .json({ message: "profile size should not be more than 5MB" });
      }

      blog.image = image.buffer.toString("base64");
    }

    // update blog
    blog.title = blogData.title;
    blog.content = blogData.content;
    await blog.save();

    res.json({
      message: "Blog updated Successfully!",
      blog: blog,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

/*
    DELETE BLOG
    DELETE /api/blogs/:id
*/
async function DeleteBlog(req, res) {
  // get blog id
  const { user } = req.token;
  const blogId = req.params.id;

  try {
    // check if blog exists with the user
    const blog = await Blog.findOne({ _id: blogId, user: user._id });
    
    // check if blog exists
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // delete the blog
    await Blog.deleteOne({ _id: blog });

    // send the response
    return res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/*
    STAR RATING TI THE BLOG
    POST /api/blogs/:id/star
*/
async function StarBlog(req, res) {
  
  const { user } = req.token;
  const blogId = req.params.id;
  const { rating } = req.body;

  try {
    // check if blog exists with the user
    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // update the rating
    const existingRating = [...blog.ratings];

    // check if user already rated the blog
    const userRating = existingRating.find((r) => r.user.toString() === user._id.toString());
    if (userRating) {
      const updatedRatings = existingRating.map((r) => {
        if (r.user.toString() === user._id.toString()) {
          r.rating = rating;
          return r;
        }
        return r;
      });
      
      blog.ratings = updatedRatings;
      await blog.save();
    } else {
      existingRating.push({ user: user._id, rating });
      blog.ratings = existingRating;
      await blog.save();
    }

    // send the response
    return res.status(200).json({ message: "Blog rated successfully" });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/*
    GET USER BLOGS
    GET /api/blogs/user
*/
async function GetUserBlogs(req, res) {
  const { user } = req.token;

  try {
    // get all blogs of the user
    const blogs = await Blog.find({ user: user._id });

    // send the response
    return res.status(200).json({ 
      message: "Blogs fetched successfully!",
      data: blogs
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = { CreateBlog, GetAllBlogs, GetBlogById, UpdateBlog, DeleteBlog, StarBlog, GetUserBlogs };
