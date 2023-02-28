const { User } = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");

const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [tokenType, token] = authHeader.split(" ");
  if (tokenType === "Bearer" && token) {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(verifiedToken._id);
    if (!user || !user.token) {
      throw new Unauthorized("Not authorized");
    }
    req.user = user;
    return next();
  }
};

module.exports = {
  auth,
};
