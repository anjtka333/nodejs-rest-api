const Joi = require("joi");
const Contact = require("./schema");

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    console.log(contacts);
    return contacts;
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async (contactId) => {
  const data = await Contact.findById(contactId);
  return data;
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

const addContact = async (body) => {
  const { name, email, phone, favorite } = body;
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.required(),
  });
  const data = await new Contact({ name, email, phone, favorite });
  const validationResult = schema.validate(body);
  if (validationResult.error) return false;
  await data.save();
  return data;
};

const updateContact = async (contactId, body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.required(),
    favorite: Joi.boolean(),
  });
  const validationResult = schema.validate(body);
  if (validationResult.error) return validationResult.error.details[0].message;
  return await Contact.update({ _id: contactId }, body);
};

const updateStatusContact = async (contactId, body) => {
  const data = await listContacts();
  const postIndex = data.findIndex((item) => contactId === item.id);
  if (postIndex === -1) return false;
  const { favorite } = body;
  const schema = Joi.boolean();
  const validationResult = schema.validate(favorite);
  if (validationResult.error) return validationResult.error.details[0].message;
  return await Contact.updateOne({ _id: contactId }, { favorite: favorite });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
