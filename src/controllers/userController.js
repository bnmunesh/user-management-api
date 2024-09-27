const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const success = await userService.softDeleteUser(req.params.userId);
    if (success) {
      res.status(200).send('User soft deleted');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forceDeleteUser = async (req, res) => {
  try {
    console.log(req.params.userId);
    const success = await userService.forceDeleteUser(req.params.userId);
    if (success) {
      res.status(200).send('User hard/force deleted');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
