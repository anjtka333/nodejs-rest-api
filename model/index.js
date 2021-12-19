const fs = require("fs/promises");
const path = require("path");
const Joi = require("joi");
const dbPath = path.join(__dirname, "./contacts.json");
const { v4: uuid } = require("uuid");

const listContacts = async () => JSON.parse(await fs.readFile(dbPath, "utf-8"));

const getContactById = async (contactId) => {
  const data = await listContacts();
  return data.find((item) => contactId === item.id);
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const postIndex = data.findIndex((item) => contactId === item.id);
  if (postIndex === -1) return false;
  data.splice(postIndex, 1);
  fs.writeFile(dbPath, JSON.stringify(data));
  return true;
};

const addContact = async (body) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.required(),
  });
  const data = await listContacts();
  const validationResult = schema.validate(body);
  if (validationResult.error) return false;
  console.log(validationResult);
  const newPost = { ...body, id: uuid() };
  data.push(newPost);
  fs.writeFile(dbPath, JSON.stringify(data));
  return newPost;
};

const updateContact = async (contactId, body) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.required(),
  });
  const validationResult = schema.validate(body);
  if (validationResult.error) return validationResult.error.details[0].message;
  const data = await listContacts();
  const postIndex = data.findIndex((item) => contactId === item.id);
  if (postIndex === -1) return false;
  const newPost = { ...data[postIndex], ...body, id: data[postIndex].id };
  data.splice(postIndex, 1, newPost);
  fs.writeFile(dbPath, JSON.stringify(data));
  return newPost;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
