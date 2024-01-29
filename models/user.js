module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    type: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    otp: DataTypes.INTEGER,
    otpExpiry: DataTypes.DATE,
    otpTries: DataTypes.INTEGER,
    address: DataTypes.JSON,
  },{
    underscored: true,
  });
  return User;
};