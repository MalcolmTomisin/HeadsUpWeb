const Sequelize = require("sequelize");
require("dotenv").config();
const config = require("./index.js");

const sequelize = new Sequelize(
  config.api.db,
  config.api.user,
  config.api.pass,
  {
    host: config.api.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
  }
);

module.exports = sequelize;