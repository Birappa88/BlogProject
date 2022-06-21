const blogModel=require("../models/blogModel")

let createBlog=async function(req,res){
    let data= req.body
    let savedData=await blogModel.create(data)
    res.status(201).send({status:true,msg:savedData})
}

let getBlogs = async function (req, res) {
    let filterData = await blogModel.find({isDeleted: false, isPublished: true})
    res.send({data: filterData})
}
module.exports.createBlog=createBlog
module.exports.getBlogs = getBlogs
