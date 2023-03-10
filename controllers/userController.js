const { User } = require("../models/user.model");
const { Conflict, Unauthorized, NotFound } = require("http-errors");
const gravatar = require("gravatar")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers/sendEmail");
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("Email is already in use"); 
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
    const newUser = new User({ email, password, avatarURL, verificationToken });
  await newUser.save();
  const mail = {
    to: email,
    subject: "Confirm email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm email</a>`,
  };
  await sendEmail(mail);
    return res.status(201).json({
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
          verificationToken: newUser.verificationToken,
        },
      },
    });
  
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user.verify) {
    throw new Unauthorized("Email is not verified, please check you mailbox");
  }
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

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;
  try {
    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(tempUpload);
    const resultUpload = path.join(avatarsDir, imageName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken,
  });
  if (!user) {
    throw NotFound("User not found");
  }
  if (!user.verify) {
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    return res.json({
      message: "Verification successful",
    });
  }
  if (user.verify) {
    return res.json({
      message: "Verification has already been passed",
    });
  }
};

const repeatVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }
  await sendEmail({ email, token: user.verificationToken });
  return res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verify,
  repeatVerify,
};
