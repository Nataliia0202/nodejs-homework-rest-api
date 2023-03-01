const { User } = require("../models/user.model");
const { Conflict, Unauthorized } = require("http-errors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("Email is already in use"); 
  }
  
    const newUser = new User({ email, password });
    newUser.save();
    return res.status(201).json({
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isPasswordTheSame = await bcrypt.compare(password, user.password);
  if (!user || !isPasswordTheSame) {
    throw new Unauthorized("Email or password is wrong");
  }
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  user.token = token;
  await User.findByIdAndUpdate(user._id, user);
  res.json({
    data: {
      token: user.token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};

const logout = async (req, res) => {
  const { user } = req;
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(204).json({});
};

const current = async (req, res) => {
  const { user } = req;
  if (user) {
    return res.status(200).json({
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  }
  return res.status(401).json({ message: "Not authorized" });
};

module.exports = {
  register,
  login,
  logout,
  current,
};
