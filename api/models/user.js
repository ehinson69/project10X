"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: {
          msg: "ID is required"
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last name is required"
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password is required"
        }
      }
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Course);
  };
  return User;
}
