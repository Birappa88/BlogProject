const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

// =========[ Create Blogs]============

let createBlog = async function (req, res) {
  try {
    let data = req.body;

    let authorId = data.authorId;
    if (!authorId) return res.status(400).send("Author Id Is requaired");

    let authorData = await authorModel.findById(authorId);
    if (!authorData) return res.status(404).send("Invalid Author Id");

    let savedData = await blogModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
// ================[ get Blogs]============

let getBlog = async function (req, res) {
  let filterBlog = req.query
  let data = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, filterBlog] })
  if (!data.length) res.status(404).send({ status: false, msg: "not found" })

  // let blogs = await blogModel.find({authorId: id} )
  // if(blogs.length==0){
  //     res.status(404).send({status: false, msg:"not found"})
  // }else{
  res.send({ status: true, msg: data })


};

let updateBlogs = async function (req, res) {
  try {
    let blogId = req.params.blogId
    let toBeUpdate = req.body
    let data = await blogModel.findOneAndUpdate(
      { _id: blogId },
      toBeUpdate,
      { new: true }
    )

    res.send({ status: true, msg: data })
  } catch (err) {
    res.send({ msg: err.message })
  }

};








// =====================[ delete Blogs]=====================
let deleteApi = async (req, res) => {
  try {
    let userId = req.params.userId;
    let updatedUser = await blogModel.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true, deletedAt: Date() },
      { new: true }
    );

    res.status(201).send({ status: true, data: updatedUser });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


let deleteByParam = async (req, res) => {
  try {
    let deleteData = req.query 
    let updatedUser = await blogModel.updateMany(
      {$and: [deleteData]},
      {$set: {isDeleted: true}},
      {new: true}
    )
      

    res.status(201).send({ status: true, data: updatedUser });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createBlog = createBlog;
module.exports.deleteApi = deleteApi;
module.exports.getBlog = getBlog;
module.exports.updateBlogs = updateBlogs
module.exports.deleteByParam = deleteByParam;

