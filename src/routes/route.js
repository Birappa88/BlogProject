const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const Middleware = require("../middleware/checkAuth");


router.post("/authors", authorController.createAuthor);

router.post("/blogs", Middleware.authenticate, blogController.createBlog);

router.get("/blogs", blogController.getBlog);

router.put("/blogs/:blogId", blogController.updateblogs);

router.delete("/blogs/:blogId", blogController.deleteApi);

router.delete("/blogs", blogController.deleteByParam);

router.post("/login", authorController.loginUser);



module.exports = router;
