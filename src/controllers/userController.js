const userService = require('../services/userService');
const jwt = require('jsonwebtoken');



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
    const {firstName, lastName, email, phoneNumber, password} = req.body;
    if(password.length<5 || password.length > 50){
      return res.status(400).json({message: 'Password length should be between 5-50'});
    }
    const user = await userService.createUser(firstName, lastName, email, phoneNumber, password);
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

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userService.authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, firstName: user.firstName, lastName: user.lastName, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', userId: user.userId, email: user.email, jwtToken: token });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};