module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
     id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING, 
      pincode: DataTypes.INTEGER, 
      country: DataTypes.STRING, 
      latitude: DataTypes.FLOAT, 
      longitude: DataTypes.FLOAT
  },{
    underscored: true,
  });
  return Address;
};