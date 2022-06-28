// ==+==+==+==+==+==+==+==+==+==[Imports]==+==+==+==+==+==+==+==+==+==
const mongoose = require('mongoose');
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

// ==+==+==+==[Validation Functions]==+==+==+==+=

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string")
    return true;
};

const isValidBody = function (body) {
  return Object.keys(body).length > 0
}

const isValidAuthorId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidBlogId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}

// ==+==+==+==+==+==+==+==+==+==[Create Blogs]==+==+==+==+==+==+==+==+==+==

let createBlog = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide data to Create" })

    let { authorId, body, title, tags, category, subcategory } = data

    if (!title) return res.status(400).send({ status: false, msg: "title Is required" });
    if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is Invalid" })

    let Title = await blogModel.findOne({ title })

    if (Title) return res.status(400).send({ status: false, msg: "Title has been already used choose different" })

    if (!authorId) return res.status(400).send({ status: false, msg: "Please provide Author Id" });

    if (!isValidAuthorId(authorId)) return res.status(400).send({ status: false, msg: "Please provide Valid Author Id" });

    let authorData = await authorModel.findById(authorId);
    if (!authorData) return res.status(404).send({ status: false, msg: "Author Id not found!" });

    const token = req.authorId
    if (token !== data.authorId) return res.status(401).send({ status: false, msg: "unauthorised! User logged is not allowed" });

    if (!isValid(authorId)) return res.status(400).send("Please provide Author Id");
    if (!isValidAuthorId(authorId)) return res.status(400).send({ status: false, msg: `${authorId} is not valid authorId` })

    if (!body) return res.status(400).send("please write somthing in body");
    if (!isValid(body)) return res.status(400).send({ status: false, msg: "body cannot be number" })

    if (!tags) return res.status(400).send({ status: false, msg: "tags are required" });

    if (!category) return res.status(400).send({ status: false, msg: "category Is required" });
    if (!isValid(category)) return res.status(400).send({ status: false, msg: "Category is Invalid" })

    if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory's are required" });

    
    if(data.isPublished==true) {$set:{data.publishedAt = new Date()}}

    let savedData = await blogModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


// ==+==+==+==+==+==+==+==+==+==[Get Blogs List]==+==+==+==+==+==+==+==+==+==

let getBlog = async function (req, res) {
  try {
    let filterBlog = req.query;

    if (!isValidBody(filterBlog)) return res.status(404).send({ status: false, msg: "please set filter to get blog data" })

    let getData = await blogModel.find({
      $and: [{ isDeleted: false, isPublished: true }, filterBlog],
    })

    if (getData.length === 0) return res.status(404).send({ status: false, msg: "Blog not found!" });

    res.status(200).send({ status: true, data: getData })

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


// ==+==+==+==+==+==+==+==+==+==[Update Blogs]==+==+==+==+==+==+==+==+==+==

const updateblogs = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;
    if (!isValidBlogId(blogId)) return res.status(400).send({ status: false, msg: "Incorrect Blog Id format" })

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "input can't be empty" })

    let checkBlog = await blogModel.findById(blogId);

    if (!checkBlog) return res.status(404).send({ status: false, msg: "Blog Not Found" });
 
    const token = req.authorId
    if (token !== checkBlog.authorId.toString()) res.status(401).send({ status: false, msg: "unauthorised! not allowed to update" });

    if (checkBlog.isDeleted == true) return res.status(400).send({ status: false, msg: "This blog is already Deleted" });

    let update = await blogModel.findByIdAndUpdate(blogId, { $push: { tags: data.tags, subcategory: data.subcategory }, title: data.title, body: data.body, isPublished: data.isPublished, }, { new: true });

    if (data.isPublished == true) { $set: { update.publishedAt = new Date() } }

    res.status(200).send({ status: true, msg: "Blog update is successful", data: update });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


// ==+==+==+==+==+==+==+==+==+==[ Delete Blogs By Id ]==+==+==+==+==+==+==+==+==+==

let deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;

    if (!isValidBlogId(blogId)) return res.status(400).send({ status: false, msg: "Incorrect Blog Id format" })

    let checkBlog = await blogModel.findById(blogId);

    if (!checkBlog) return res.status(404).send({ status: false, msg: "Blog Not Found" });

    const token = req.authorId
    if (token !== checkBlog.authorId.toString()) res.status(401).send({ status: false, msg: "unauthorised! not allowed to delete blog" });

    if (checkBlog.isDeleted == true)
      return res.status(400).send({ status: false, msg: "This blog is already Deleted" });

    await blogModel.findOneAndUpdate(
      { _id: checkBlog },
      { isDeleted: true, deletedAt: Date() },
      { new: true }
    );
    res.status(200).send({ status: true, msg: `${checkBlog.title} -: this blog is deleted` });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


// ==+==+==+==+==+==+==+==+==+==[ Delete Blogs By Query ]==+==+==+==+==+==+==+==+==+==

let deleteByQuery = async (req, res) => {

  try {
    const queryParams = req.query

    const blog = await blogModel.find({ ...queryParams, isDeleted: false })

    // Checking authorisation on each document inside blog & pushing the id's of all those documents inside arr which are passes authorisation

    let arr = []
    blog.forEach((ele, index) => {
      if (req.authorId == ele.authorId.toString()) arr.push(ele._id)
    })

    const deletedBlog = await blogModel.updateMany({ _id: arr }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

    if (deletedBlog.modifiedCount == 0) return res.status(404).send({ status: false, msg: "Blog doesn't Exist of this query" })

    return res.status(200).send({ status: true, data: `Number of documents deleted : ${deletedBlog.modifiedCount}` })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


// ==+==+==+==+==+==+==+==+==+==[ Exports ]==+==+==+==+==+==+==+==+==+==

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateblogs = updateblogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;
