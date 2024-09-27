const db = require('../models');
const { Op } = require('sequelize');

const User = db.User;

exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] }
  });
};

exports.getUserById = async (userId) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
};

exports.createUser = async (userData) => {
  return await User.create(userData);
};

exports.updateUser = async (userId, userData) => {
  const user = await User.findByPk(userId);
  if (user) {
    return await user.update(userData);
  }
  return null;
};

exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    await user.destroy({force: true});
    return true;
  }
  return false;
};