const AuthorModel = require("../models/authorModel")

const isValid = function(value)
{
    if(typeof value === 'undefined' || value === null){
        return false
    }
    if(typeof value === 'string' && value.trim().length == 0){
        return false
    }
    return true

}

// =========[ Create Authors API]============
const createAuthor = async function (req, res) {
    try {
        let author = req.body
        // let {fname,lname,email,password,title} = author

 
        // if(isValid(fname))
        // return res.status(400).send({status: false, msg: "first name is not valid"})
        // if(!isValid(fname))
        // return res.status(400).send({status: false, msg: "fast name is required"})


        // if(isValid(lname))
        // return res.status(400).send({status: false, msg: "last name is not valid"})
        // if(!isValid(lname))
        // return res.status(400).send({status: false, msg: "last name is required"})
        
        // if(isValid(title))
        // return res.status(400).send({status: false, msg: " title is not valid"})
        // if(!isValid(title))
        // return res.status(400).send({status: false, msg: " title is required"})
        
        // if(isValid(email))
        // return res.status(400).send({status: false, msg: "email is not valid"})
        // if(!isValid(email))
        // return res.status(400).send({status: false, msg: "email id is required"})
        
        // if(isValid(password))
        // return res.status(400).send({status: false, msg: "password is not valid"})
        // if(!isValid(password))
        // return res.status(400).send({status: false, msg: "password is required"})

        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createAuthor = createAuthor