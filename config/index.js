require('dotenv').config();

module.exports = {
  envSecret: process.env.SECRET,
  environement: process.env.NODE_ENV,
  database: process.env.MONGO_DB,
  port: process.env.PORT,
};
