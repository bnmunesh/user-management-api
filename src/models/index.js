const dbConfig = require('../config/database.js');

const {Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    // logging: console.log  // This will log SQL queries
  }
);

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize

// Read all model files in the current directory except index.js file
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

  module.exports = db;