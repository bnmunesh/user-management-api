const userController = require('../controllers/userController');
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

jest.mock('../services/userService');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
      userService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      userService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'John' };
      req.params.userId = '1';
      userService.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      req.params.userId = '999';
      userService.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123'
      };
      req.body = newUser;
      userService.createUser.mockResolvedValue(newUser);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });

    it('should return 400 if password length is invalid', async () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'pwd'
      };

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password length should be between 5-50' });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = { id: 1, name: 'John Updated' };
      req.params.userId = '1';
      req.body = { name: 'John Updated' };
      userService.updateUser.mockResolvedValue(updatedUser);

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 if user is not found', async () => {
      req.params.userId = '999';
      req.body = { name: 'John Updated' };
      userService.updateUser.mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });
  });

  describe('softDeleteUser', () => {
    it('should soft delete a user', async () => {
      req.params.userId = '1';
      userService.softDeleteUser.mockResolvedValue(true);

      await userController.softDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('User soft deleted');
    });

    it('should return 404 if user is not found', async () => {
      req.params.userId = '999';
      userService.softDeleteUser.mockResolvedValue(false);

      await userController.softDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });
  });

  describe('forceDeleteUser', () => {
    it('should force delete a user', async () => {
      req.params.userId = '1';
      userService.forceDeleteUser.mockResolvedValue(true);

      await userController.forceDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('User hard/force deleted');
    });

    it('should return 404 if user is not found', async () => {
      req.params.userId = '999';
      userService.forceDeleteUser.mockResolvedValue(false);

      await userController.forceDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const mockUser = { userId: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      req.body = { email: 'john@example.com', password: 'password123' };
      userService.authenticateUser.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockedToken');

      await userController.loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        userId: mockUser.userId,
        email: mockUser.email,
        jwtToken: 'mockedToken'
      });
    });

    it('should return 400 if email or password is missing', async () => {
      req.body = { email: 'john@example.com' };

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });

    it('should return 401 if authentication fails', async () => {
        req.body = { email: 'john@example.com', password: 'wrongpassword' };
        userService.authenticateUser.mockResolvedValue(null);
  
        await userController.loginUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
      });
  
      it('should handle errors during login', async () => {
        req.body = { email: 'john@example.com', password: 'password123' };
        userService.authenticateUser.mockRejectedValue(new Error('Database error'));
  
        await userController.loginUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred during login' });
      });
    });
  });