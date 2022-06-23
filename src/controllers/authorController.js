const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'string')
    return true
}

// const isValidA = function (body) {
// return Object.keys(body).length > 0
// }
// =========[ Create Authors API]============

const createAuthor = async function (req, res) {
    try {
        let author = req.body

        let { fname, lname, title, email, password } = author

        if (!isValid(fname)) return res.status(400).send({ status: false, msg: "first name is not proper" })

        if (!isValid(lname)) return res.status(400).send({ status: false, msg: "last name is not proper" })
       
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is not proper" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: "title is not as per requirement" })
       
        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email Id is not proper" })
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is Invalid" })
        let Email = await AuthorModel.findOne({ email })
        if (Email) return res.status(400).send({ status: false, msg: "email is already used" })
        
        if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is required" })
        

        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const loginUser = async function (req, res) {
    try {
        data = req.body
        let { email, password } = data

        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email Id is not proper" })
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is invalid" })
        let Email = await AuthorModel.findOne({ email })
        if (!Email) return res.status(400).send({ status: false, msg: "email is not correct" })

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is not proper" })
        let Password = await AuthorModel.findOne({ password })
        if (!Password) return res.status(400).send({ status: false, msg: "PassWord is not correct" })
        
        let author = await AuthorModel.findOne({email: email, password: password})
        let token = jwt.sign(
            {
                userId: author._id.toString(),
                batch: "radon",
                organisation: "FunctionUp",
            },
            "Radon-Project-1"
        );
        res.setHeader("x-api-key", token);
        res.send({ status: true, token: token });
    } catch (error) {
        res.status(500).send({ status: false, reason: error.message })
    }
};

module.exports.createAuthor = createAuthor
module.exports.loginUser = loginUser