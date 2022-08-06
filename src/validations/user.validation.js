const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    emailAddress: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    userName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUserAccount = {
  body: Joi.object().keys({
    accountNumber: Joi.number().integer(),
    identityNumber: Joi.number().integer(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      emailAddress: Joi.string().email(),
      password: Joi.string().custom(password),
      userName: Joi.string(),
      role: Joi.string(),
      accountNumber: Joi.number(),
      identityNumber: Joi.number(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserAccount,
  updateUser,
  deleteUser,
};
