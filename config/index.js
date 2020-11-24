require('dotenv').config();

module.exports = {
  secret: process.env.NODE_ENV === 'development' ? process.env.SECRET : 'secret',
  environement: process.env.NODE_ENV,
  database: process.env.MONGO_DB,
  port: process.env.PORT,
};
