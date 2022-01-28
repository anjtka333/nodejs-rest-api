const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const passport = require("passport");
const multer = require("../../multer");
const { v4: uuidv4, v4 } = require("uuid");
const gravatar = require("gravatar");
const Jimp = require("jimp");
require("dotenv").config();
const transporter = require("../../mail");
const secret = process.env.SECRET;
const {
  signUp,
  verifyToken,
  resendToken,
  login,
  logout,
  getCurrentUser,
  downloadAvatar,
} = require("../../controler/users/users");
const {
  listUsers,
  getUserById,
  addUser,
  updateUser,
  removeUser,
  signupUser,
  getUserByEmail,
  updateTokenById,
  veryfyByToken,
  updateTokenByEmail,
} = require("../../model/Users");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || req.headers.authorization !== "Bearer " + user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/verify/:verificationToken", verifyToken);

router.post("/verify", resendToken);

router.post("/", async (req, res, next) => {
  try {
    const result = await addUser(req.body);
    if (!result) throw new Error("missing field required");
    return res.status(201).json(result);
  } catch (err) {
    next(createError(404, err));
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const result = await removeUser(req.params.userId);
    if (!result) throw new Error("Not found");
    res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    next(createError(404, err));
  }
});

router.post("/signup", signUp);

router.post("/login", login);

router.get("/logout", auth, logout);

router.get("/current", auth, getCurrentUser);

router.patch("/avatars", auth, multer.single("picture"), downloadAvatar);

module.exports = router;
