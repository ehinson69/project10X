"use strict";
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      }
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: false,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: false,
      allowNull: false
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  });
  Course.associate = function(models) {
    // associations can be defined here
    Course.belongsTo(models.User);
  };
  return Course;
};
