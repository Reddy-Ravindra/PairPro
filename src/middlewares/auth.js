const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
          return res.status(401).send("Unauthorized: No token provided");
          // throw new Error("Invalid token provided");
        }

        const decodedToken = await jwt.verify(token, "PairPro@800855$");

        const { _id: userId } = decodedToken;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send("User not found");
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
}

module.exports = {
    userAuth
}