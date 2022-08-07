const httpStatus = require('http-status');
const util = require('util');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const redis = require('../loaders/redisClientLoader');

const setAsync = util.promisify(redis.SET).bind(redis);
const getAsync = util.promisify(redis.GET).bind(redis);

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const userCache = await getAsync('foo');
  if (!userCache) {
    const result = await userService.queryUsers(filter, options);
    const cacheResponse = await setAsync('foo', JSON.stringify(result));
    res.send(result);
    return new Promise((resolve, reject) =>
      cacheResponse !== 'OK' ? reject(new Error('REDIS SET FAILED')) : resolve(result)
    );
  }
  res.send(JSON.parse(userCache));
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUserByAccountNumber = catchAsync(async (req, res) => {
  const user = await userService.getUserByAccountNumber(req.body.accountNumber);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUserByIdentityNumber = catchAsync(async (req, res) => {
  const user = await userService.getUserByIdentityNumber(req.body.identityNumber);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserByAccountNumber,
  getUserByIdentityNumber,
  updateUser,
  deleteUser,
};
