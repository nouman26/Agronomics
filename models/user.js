module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    type: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: {type: DataTypes.BOOLEAN,  defaultValue: true},
    otp: DataTypes.INTEGER,
    otpExpiry: DataTypes.DATE,
    otpTries: {type: DataTypes.INTEGER,  defaultValue: 0},
  },{
    underscored: true,
  });
  return User;
};