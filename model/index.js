"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../config/database.js");

const UserModel = (instance, datatype) => {
    return sequelize.define("user", {
      id: {
        type: datatype.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      firstName: datatype.STRING,
      lastName: datatype.STRING,
      email: datatype.STRING,
      phone: datatype.STRING,
      password: datatype.STRING,
      emailVerificationToken: datatype.STRING,
      emailVerified: {
        type: datatype.BOOLEAN,
        defaultValue: false,
      },
      passwordRecoveryToken: datatype.INTEGER,
      isAdmin: {
        type: datatype.BOOLEAN,
        defaultValue: false,
      },
    }, {
        paranoid: true
    });
}

const User = UserModel(sequelize, Sequelize);