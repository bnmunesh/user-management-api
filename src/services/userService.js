const db = require('../models');
const { Op } = require('sequelize');

const User = db.User;

exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password', 'deletedAt'] }
  });
};

exports.getUserById = async (userId) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ['password', 'deletedAt'] }
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

exports.softDeleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

exports.forceDeleteUser = async (userId) => {
  const user = await User.findOne({ where: { userId }, paranoid: false });
  if (user) {
    await user.destroy({force: true});
    return true;
  }
  return false;
};