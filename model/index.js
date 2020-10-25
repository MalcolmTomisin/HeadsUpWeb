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
      alias: datatype.STRING,
      password: datatype.STRING,
      isAdmin: {
        type: datatype.BOOLEAN,
        defaultValue: false,
      },
      picture: datatype.STRING,
    }, {
        paranoid: true
    });
}

const User = UserModel(sequelize, Sequelize);

const HazardModel = (instance, datatype) => {
  return sequelize.define("hazard", {
    id: {
      type: datatype.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    location: datatype.GEOMETRY("POINT"),
    address: datatype.TEXT,
    city: datatype.STRING,
    isVerified: {
      type: datatype.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blacklisted: { type: datatype.BOOLEAN },
    state: datatype.STRING,
    LGA: datatype.STRING,
    tag: datatype.STRING,
    fixed: {
      type: datatype.BOOLEAN,
      defaultValue: false
    }
  });
}

const Hazard = HazardModel(sequelize, Sequelize);

const ImageModel = (sequelize, datatype) => {
  return sequelize.define(
    "image",
    {
      id: {
        type: datatype.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: datatype.STRING,
      },
      tag: datatype.STRING,
    },
    {
      paranoid: true,
    }
  );
};

const Image = ImageModel(sequelize, Sequelize);

User.hasMany(Hazard);
Hazard.belongsTo(User);
Hazard.hasOne(Image);
Image.belongsTo(Hazard);

sequelize.sync({}).then(() => {
  console.log(`Database & tables created..`);
});

module.exports = {
  User,
  Hazard
};