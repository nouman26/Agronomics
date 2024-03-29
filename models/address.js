module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define('Address', {
     id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      shop: Sequelize.DataTypes.STRING,
      address: Sequelize.DataTypes.STRING,
      tehsil: Sequelize.DataTypes.STRING,
      city: Sequelize.DataTypes.STRING, 
      district: Sequelize.DataTypes.STRING,
  },{
    underscored: true,
  });
  return Address;
};