const jwt = require("jsonwebtoken")

// =====================[authentication]================

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];
        
        if (!token) return res.status(401).send({ status: false, msg: "token must be present", });

        let decodedToken = jwt.verify(token, "Radon-project-1", (err, decoded)=>{
            if(err){
                res.status(400).send({status: false , Error : err.message})
            }else{
                return decoded
            }
        })

        if (!decodedToken) return res.status(403).send({ status: false, msg: "token is invalid", });
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message });
    }
    next();
};

// ===============[check authorid or token is same or not for creating blogs]============

const auth2 = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Radon-project-1")
        console.log(decodedToken.authorId)
        console.log(req.body.authorId)

        if (decodedToken.authorId !== req.body.authorId)
        return res.status(403).send({ status: false, msg: "author id or token does not match" })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message });
    }
    next();
};

// =====================[authorization for updating and deleting]================

const authorise = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Radon-project-1");
        if (!decodedToken) return res.status(403).send({ status: false, msg: "token is invalid", });

        let findauthorId = decodedToken.authorId;
        let checkAuthor = req.params.blogId.authorId
        if (checkAuthor !== findauthorId)
            return res.status(403).send({ status: false, msg: "User logged is not allowed to modify the requested users data", });
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message, });
    }
    next();
};

// =====================[Exports]================

module.exports.authenticate = authenticate;
module.exports.auth2 = auth2;
module.exports.authorise = authorise;
