const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const {
  listUsers,
  getUserById,
  addUser,
  updateUser,
  removeUser,
  signupUser,
  getUserByEmail,
} = require("../../model/Users");

router.get("/", async (req, res, next) => {
  try {
    res.json(await listUsers());
    return res.status(200);
  } catch (err) {
    next(createError(err));
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const result = await getUserById(req.params.userId);
    if (!result) throw new Error("Not found");
    return res.json(result);
  } catch (err) {
    next(createError(400, err));
  }
});

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
  console.log(req.body);
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
  // phj,bnb kjusy
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

module.exports = router;
