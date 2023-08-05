const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = new Sequelize("postgres");

async function testSequelize() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testSequelize();

class User extends Sequelize.model {}
User.init(
  {
    name: DataTypes.STRING,
    breed: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

(async () => await sequelize.sync())();

exports.User = User;
