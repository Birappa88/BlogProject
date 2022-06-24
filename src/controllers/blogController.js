const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};


// =========[ Create Blogs]============

let createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { authorId, body, title, tags, category, subcategory } = data

    if (!title) return res.status(400).send("title Is required");
    if (!isValid(title)) return res.status(400).send({ status: false, Error: "title is Invalid" })

    if (!isValid(authorId)) return res.status(400).send("Please provide Author Id");

    let authorData = await authorModel.findById(authorId);
    if (!authorData) return res.status(404).send("Author Id not found!");


    if (!body) return res.status(400).send("please write somthing in body");
    if (!isValid(body)) return res.status(400).send({ status: false, Error: "body cannot be number" })

    if (!tags) return res.status(400).send("tags Is required");
    if (!isValid(tags)) return res.status(400).send({ status: false, Error: "tags are Invalid" })

    if (!category) return res.status(400).send("category Is required");
    if (typeof category !== "string") return res.status(400).send({ status: false, Error: "Category is Invalid" })

    if (!subcategory) return res.status(400).send("subcategory Is required");


    let savedData = await blogModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}


// ================[ get Blogs]============

let getBlog = async function (req, res) {
  try {
    let filterBlog = req.query;

    let data = await blogModel.find({
      $and: [{ isDeleted: false, isPublished: true }, filterBlog],
    });
    if (!data) return res.status(404).send({ status: false, msg: "data not found" });

    res.status(200).send({ status: true, msg: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ===================[ update blogs]================

let updateblogs = async (req, res) => {
  try {
    let blogsId = req.params.blogId;
    if (!blogsId) return res.status(400).send("Blog Id is not proper");

    // -----------------check blog id is valid or not
    let blogData = await blogModel.findById(blogsId);
    if (!blogData) return res.status(404).send("Invalid blog Id");

    // ------------check isDeleted = false
    if (blogData.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "blog is not published" });

    let data = req.body;l
    console.log(data.length)
    if (data.length === 0) return res.send({status: false, msg: "data not found"})
      let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogsId }, data, {
        new: true,
      });

    if (updatedBlog.isPublished == false) {
      res.status(200).send({ status: true, data: updatedBlog });
    } else {
      updatedBlog.publishedAt = Date();
      res.status(200).send({ status: true, data: updatedBlog });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// =====================[ delete Blogs by blog ID]=====================

let deleteApi = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    // -----------------check blog id is valid or not
    let blogData = await blogModel.findById(blogId);
    if (!blogData) return res.status(404).send("Invalid blog Id");

    if (blogData.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "blog is already deleted" });

    let deleteBlog = await blogModel.findOneAndUpdate(
      { _id: blogData },
      { isDeleted: true, deletedAt: Date() },
      { new: true }
    );
    res.status(200).send({ status: true, data: deleteBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// =========================[ delete Blogs by Query Params]=======================

let deleteByParam = async (req, res) => {
  try {
    let deleteData = req.query;

    if (deleteData.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "blog is already deleted" });

    let updatedUser = await blogModel.updateMany(
      { $and: [deleteData] },
      { $set: { isDeleted: true, deletedAt: Date() } },
      { new: true }
    );

    res.status(201).send({ status: true, data: updatedUser });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ===============================================================

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateblogs = updateblogs;
module.exports.deleteApi = deleteApi;
module.exports.deleteByParam = deleteByParam;
