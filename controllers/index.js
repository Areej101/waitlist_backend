// user controller imports
const { RegisterUser, LoginUser } = require('./user.controller');

// blog controller imports
const { CreateBlog, GetAllBlogs, GetBlogById, UpdateBlog, DeleteBlog, GetUserBlogs, StarBlog } = require('./blogs.controller');

// export all the controllers
module.exports = {
    RegisterUser,
    LoginUser,
    CreateBlog,
    GetAllBlogs,
    GetBlogById,
    UpdateBlog,
    DeleteBlog,
    StarBlog,
    GetUserBlogs
};