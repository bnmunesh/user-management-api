module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate:{
            notEmpty: {
              msg: "FirstName field cannot be empty"
            }
          }
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            notEmpty: {
            msg: "LastName field cannot be empty"
            }
          }
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {msg: "The email is already registered"},
          validate: {
            notEmpty: {
              msg: "Email cannot be empty"
            },
            isEmail: {msg: "Provide a valid email"}
          },
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            notEmpty: {
              msg: "Phone number cannot be empty"
            },
            isNumeric: {
              msg: "Phone number must contain only numeric characters"
            },
            len: {
              args: [8, 15],
              msg: "Phone number must be between 8 and 15 characters"
            }
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          }
        },
    }, {
      paranoid: true,
      timestamps: true, 
    });
  
    return User;
  };