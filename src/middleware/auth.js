const jwt = require("jsonwebtoken");


// ==+==+==+==+==+==+==+==+==+==[ Authentication ]==+==+==+==+==+==+==+==+==+==

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["X-Api-Key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present", });

        let decodedToken = jwt.verify(token, "Radon-project-1", (err, decoded) => {
            if (err) {
                res.status(400).send({ status: false, Error: err.message })
            }
            return decoded
        })
        if (!decodedToken) return res.status(403).send({ status: false, msg: "token is invalid" });

        req["authorId"] = decodedToken.authorId
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
    next();
};


// ==+==+==+==[ Exports ]==+==+==+==+=

module.exports.authenticate = authenticate;

