const { FORCE } = require("sequelize/lib/index-hints");
const db = require("../models/index");

const connectDB = async () => {
  try {
    await db.sequelize.sync({ alter:process.env.ALTER_DB});
    console.log("Connected to the database!");
    console.log("Server is running on Port: 4000");
    console.log("Press CTRL + C to stop the process. \n");
  } catch (error) {
    console.error("Cannot connect to the database!", error);
  }
};

module.exports = connectDB;
