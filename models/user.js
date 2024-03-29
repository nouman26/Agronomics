module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id:{
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.DataTypes.STRING,
    avatar: Sequelize.DataTypes.STRING,
    role: Sequelize.DataTypes.STRING,
    isSeller: {type: Sequelize.DataTypes.BOOLEAN,  defaultValue: false},
    isBuyer: {type: Sequelize.DataTypes.BOOLEAN,  defaultValue: false},
    phone: Sequelize.DataTypes.STRING,
    status: {type: Sequelize.DataTypes.BOOLEAN,  defaultValue: true},
    otp: Sequelize.DataTypes.INTEGER,
    otpExpiry: Sequelize.DataTypes.DATE,
    otpTries: {type: Sequelize.DataTypes.INTEGER,  defaultValue: 0},
    description: {type: Sequelize.DataTypes.STRING}
  },{
    underscored: true,
  });
  return User;
};