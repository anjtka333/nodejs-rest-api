const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model/index");

router.get("/", async (req, res, next) => {
  try {
    res.json(await listContacts());
    return res.status(200);
  } catch (err) {
    next(createError(err));
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await getContactById(req.params.contactId);
    console.log(result);
    if (!result) throw err;
    return res.json(result);
  } catch (err) {
    return res.status(404).json({ massage: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await addContact(req.body);
    if (!result) throw err;
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (!result) throw err;
    res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    return res.status(404).json({ massage: "Not found" });
  }
});

router.patch("/:contactId", async (req, res, next) => {
  try {
    const result = await updateContact(req.params.contactId, req.body);
    console.log(result);
    if (!result) throw err;
    console.log(typeof result);
    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }
    res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
