const { User } = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");

const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(verifiedToken._id);
    if (!user || !user.token || user.token !== token) {
      throw new Unauthorized("Not authorized");
    }
    req.user = user;
    next();
  }
  catch {
    next(Unauthorized("Not authorized"));
  }
};

module.exports = {
  auth,
};
