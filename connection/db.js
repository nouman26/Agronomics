const db = require("../models/index");

const connectDB = async () => {
  try {
     await db.sequelize.sync({ force: process.env.DBSYNC });
     console.log("Connected to the database!");
	console.log("Server is running on Port: 4000");
	console.log("Press CTRL + C to stop the process. \n");
  } catch (error) {
    console.error("Cannot connect to the database!", error);
  }
};

module.exports = connectDB;
