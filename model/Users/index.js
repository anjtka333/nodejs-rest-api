const Joi = require("joi");
const User = require("./schema");

const listUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (userId) => {
  const data = await User.findById(userId);
  return data;
};

const addUser = async (body) => {
  const { password, email } = body;
  const schema = Joi.object({
    password: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
  });
  const data = await new User({ password, email });
  data.setPassword(password);
  const validationResult = schema.validate(body);
  if (validationResult.error) return false;
  await data.save();
  return data;
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateTokenById = async (id, token) => {
  return User.updateOne({ _id: id }, { token });
};

const updateUser = async (userId, body) => {
  const schema = Joi.object({
    password: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
  });
  const validationResult = schema.validate(body);
  if (validationResult.error) return validationResult.error.details[0].message;
  return await User.update({ _id: userId }, body);
};

const removeUser = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  listUsers,
  getUserById,
  addUser,
  updateUser,
  removeUser,
  getUserByEmail,
  updateTokenById,
};
