const jwt = require("jsonwebtoken");

const authenticate = async function (req, res, next) {
    try{
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"];

    if (!token) return res.send({ status: false, msg: "token must be present" });
    
    let decodedToken= jwt.verify(token, "Radon-Project-1", function(err, decoded) {
        if (err) {        
           console.log(err.message)
        }else return decoded
      });
console.log(decodedToken)
    if (!decodedToken) {
        return res.send({ status: false, msg: "token is invalid" });
    }
    
        req.userId = decodedToken.userId
        next()
     
    }catch(error){
        res.status(500).send({status: false, reason: error.message})
    }
}

module.exports.authenticate = authenticate