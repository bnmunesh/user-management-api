const db = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const User = db.User;

exports.getAllUsers = async () => {
  try {
    return await User.findAll({
      attributes: { exclude: ['password', 'deletedAt'] }
    });
  } catch (error) {
    console.error('Error in getAllUsers service:', error);
    throw new Error('Failed to fetch users');
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'deletedAt'] }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error in getUserById service:', error);
    throw error;
  }
};

exports.createUser = async (firstName, lastName, email, phoneNumber, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword
    };
    return await User.create(newUserData);
  } catch (error) {
    console.error('Error in createUser service:', error);
    throw error;
  }
};

exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await user.update(userData);
  } catch (error) {
    console.error('Error in updateUser service:', error);
    throw error;
  }
};

exports.softDeleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return false;
    }
    await user.destroy();
    return true;
  } catch (error) {
    console.error('Error in softDeleteUser service:', error);
    throw new Error('Failed to soft delete user');
  }
};

exports.forceDeleteUser = async (userId) => {
  try {
    const user = await User.findOne({ where: { userId }, paranoid: false });
    if (!user) {
      return false;
    }
    await user.destroy({ force: true });
    return true;
  } catch (error) {
    console.error('Error in forceDeleteUser service:', error);
    throw new Error('Failed to force delete user');
  }
};

exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;

  } catch (error) {
    console.error('Error in authenticateUser service:', error);
    throw new Error('Authentication failed');
  }
};