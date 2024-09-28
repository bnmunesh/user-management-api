# User Management API

## 1. Overview

This User Management System application is a simple CRUD backend service built with Node.js and Express. It provides a RESTful API for managing user data, including features like user registration, authentication, and profile management. The application uses JSON Web Tokens (JWT) for secure authentication and implements both soft and hard delete functionalities.

## 2. Features/Endpoints

The application offers the following endpoints:

- **POST /login**: Authenticate a user and receive a JWT token
- **POST /users**: Create a new user
- **GET /users**: Retrieve all users (protected)
- **GET /users/:userId**: Retrieve a specific user by ID (protected)
- **PUT /users/:userId**: Update a user's information (protected)
- **DELETE /users/:userId**: Soft delete a user (protected)
- **DELETE /users/:userId/force**: Force/Hard delete a user from DB (protected)

All endpoints, except for login and create user require JWT authentication.

## 3. Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **Sequelize**: ORM for database management
- **JSON Web Tokens (jsonwebtoken)**: For secure authentication
- **bcrypt**: For password hashing
- **Swagger/OpenAPI**: API documentation
- **MySQL**: Database system

## 4. Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm (usually comes with Node.js)
- MySQL

### Installation Steps

1. Clone the repository:

   ```
   git clone https://github.com/your-username/user-management-crud.git
   cd user-management-crud
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory with the following contents:

   ```
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=user_management_db
   JWT_SECRET=your_jwt_secret_key
   ```

4. Set up your database. Create a new MySQL database named `user_management_db` (or as specified in your `.env` file).

5. Start the server:
   ```
   npm run dev
   ```

The server should now be running on `http://localhost:8080` (or your specified port).

### API Documentation

After starting the server, you can access the Swagger UI API documentation at:

```
http://localhost:8080/api-docs
```

This interactive documentation allows you to explore and test all available endpoints.

## Usage

1. Use the ` -X 'POST'` `/users` endpoint to create/register a new user.
2. Use the `/login` endpoint to authenticate and receive a JWT token.
3. For all other endpoints, include the JWT token in the Authorization header:
   ```
   Authorization: Bearer your_jwt_token_here
   ```
   or, if you are using swagger - click on the authorize button on swagger ui docs page and enter the bearer token.

## Contributing

Feel free to fork the repository and submit pull requests with improvements or bug fixes.
