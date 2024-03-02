module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
     id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: DataTypes.STRING,
      tehsil: DataTypes.STRING,
      city: DataTypes.STRING, 
      district: DataTypes.STRING,
  },{
    underscored: true,
  });
  return Address;
};