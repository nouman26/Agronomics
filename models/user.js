module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING,
    isSeller: {type: DataTypes.BOOLEAN,  defaultValue: false},
    isBuyer: {type: DataTypes.BOOLEAN,  defaultValue: false},
    phone: DataTypes.STRING,
    status: {type: DataTypes.BOOLEAN,  defaultValue: true},
    otp: DataTypes.INTEGER,
    otpExpiry: DataTypes.DATE,
    otpTries: {type: DataTypes.INTEGER,  defaultValue: 0},
    description: {type: DataTypes.STRING}
  },{
    underscored: true,
  });
  return User;
};