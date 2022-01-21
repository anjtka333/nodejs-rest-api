const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
const secret = process.env.SECRET;

const {
  listUsers,
  getUserById,
  addUser,
  updateUser,
  removeUser,
  signupUser,
  getUserByEmail,
  updateTokenById,
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

router.get("/", async (req, res, next) => {
  try {
    res.json(await listUsers());
    return res.status(200);
  } catch (err) {
    next(createError(err));
  }
});

// router.get("/:userId", async (req, res, next) => {
//   try {
//     const result = await getUserById(req.params.userId);
//     if (!result) throw new Error("Not found");
//     return res.json(result);
//   } catch (err) {
//     next(createError(400, err));
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    const result = await addUser(req.body);
    if (!result) throw new Error("missing field required");
    return res.status(201).json(result);
  } catch (err) {
    next(createError(404, err));
  }
});

router.patch("/:userId", async (req, res, next) => {
  try {
    const result = await updateUser(req.params.userId, req.body);
    if (!result) throw new Error("Not found");
    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }
    res.status(200).json(result);
  } catch (err) {
    next(createError(400, err));
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

router.post("/signup", async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (user)
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    await addUser(req.body);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (!user || !user.validPassword(req.body.password)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Incorrect login or password",
        data: "Bad request",
      });
    }
    const payload = {
      id: user.id,
      password: user.password,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    await updateTokenById(user.id, token);
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", auth, async (req, res, next) => {
  await updateTokenById(req.user.id, null);
  res.json({
    status: "success",
    code: 200,
    data: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
});

router.get("/current", auth, async (req, res, next) => {
  try {
    return res.json({
      status: "success",
      code: 200,
      data: {
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
