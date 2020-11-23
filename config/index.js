require('dotenv').config();

module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  environement: process.env.ENVIRONEMENT,
  database: process.env.MONGO_DB,
  port: process.env.PORT,
};
