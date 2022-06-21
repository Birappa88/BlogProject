const express = require('express');
const router = express.Router();
const blogController = require("../controllers/blogController")

router.post("/blogs", blogController.createBlog)

router.get("/blogs", blogController.getBlogs)


module.exports = router;