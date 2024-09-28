const userService = require('../services/userService');
const db = require('../models');
const bcrypt = require('bcrypt');

jest.mock('../models');
jest.mock('bcrypt');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users without password and deletedAt', async () => {
      const mockUsers = [
        { userId: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { userId: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }
      ];
      db.User.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();
      expect(result).toEqual(mockUsers);
      expect(db.User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password', 'deletedAt'] }
      });
    });

    it('should throw an error if database query fails', async () => {
      db.User.findAll.mockRejectedValue(new Error('Database error'));

      await expect(userService.getAllUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('getUserById', () => {
    it('should return a user by id without password and deletedAt', async () => {
      const mockUser = { userId: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      db.User.findByPk.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);
      expect(result).toEqual(mockUser);
      expect(db.User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password', 'deletedAt'] }
      });
    });

    it('should throw an error if user is not found', async () => {
      db.User.findByPk.mockResolvedValue(null);

      await expect(userService.getUserById(1)).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123'
      };
      const hashedPassword = 'hashedPassword123';
      const createdUser = { ...userData, userId: 1, password: hashedPassword };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      db.User.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber,
        userData.password
      );

      expect(result).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(db.User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
    });

    it('should throw an error if user creation fails', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      db.User.create.mockRejectedValue(new Error('Database error'));

      await expect(userService.createUser('John', 'Doe', 'john@example.com', '1234567890', 'password123'))
        .rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const userId = 1;
      const userData = { firstName: 'John', lastName: 'Updated' };
      const updatedUser = { userId, ...userData };

      db.User.findByPk.mockResolvedValue({
        update: jest.fn().mockResolvedValue(updatedUser)
      });

      const result = await userService.updateUser(userId, userData);
      expect(result).toEqual(updatedUser);
      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user is not found', async () => {
      db.User.findByPk.mockResolvedValue(null);

      await expect(userService.updateUser(1, { firstName: 'John' }))
        .rejects.toThrow('User not found');
    });
  });

  describe('softDeleteUser', () => {
    it('should soft delete a user', async () => {
      const mockUser = {
        destroy: jest.fn().mockResolvedValue(true)
      };
      db.User.findByPk.mockResolvedValue(mockUser);

      const result = await userService.softDeleteUser(1);
      expect(result).toBe(true);
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should return false if user is not found', async () => {
      db.User.findByPk.mockResolvedValue(null);

      const result = await userService.softDeleteUser(1);
      expect(result).toBe(false);
    });
  });

  describe('forceDeleteUser', () => {
    it('should force delete a user', async () => {
      const mockUser = {
        destroy: jest.fn().mockResolvedValue(true)
      };
      db.User.findOne.mockResolvedValue(mockUser);

      const result = await userService.forceDeleteUser(1);
      expect(result).toBe(true);
      expect(mockUser.destroy).toHaveBeenCalledWith({ force: true });
    });

    it('should return false if user is not found', async () => {
      db.User.findOne.mockResolvedValue(null);

      const result = await userService.forceDeleteUser(1);
      expect(result).toBe(false);
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user with valid credentials', async () => {
      const mockUser = {
        userId: 1,
        email: 'john@example.com',
        password: 'hashedPassword',
        toJSON: jest.fn().mockReturnValue({
          userId: 1,
          email: 'john@example.com',
          password: 'hashedPassword'
        })
      };
      db.User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.authenticateUser('john@example.com', 'password123');
      expect(result).toEqual({ userId: 1, email: 'john@example.com' });
    });

    it('should return null for invalid credentials', async () => {
      const mockUser = {
        email: 'john@example.com',
        password: 'hashedPassword'
      };
      db.User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await userService.authenticateUser('john@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      db.User.findOne.mockResolvedValue(null);

      const result = await userService.authenticateUser('nonexistent@example.com', 'password123');
      expect(result).toBeNull();
    });
  });
});