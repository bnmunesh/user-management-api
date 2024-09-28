const express = require("express");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml');
const router = require('./routes/userRouter.js');
const db = require('./models');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please set it in your .env file.');
  process.exit(1);
}

const app = express();
const PORT = 8080;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', router);


// Testing api
app.get("/", (req, res) => {
  res.send(
    `Welocme to User Management System API <br> Swagger documentation available at <a href = http://localhost:${PORT}/api-docs>http://localhost:${PORT}/api-docs<a/>`
  );
});


//server
db.sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
    console.error('Error details:', JSON.stringify(err, null, 2));
    process.exit(1);
  });