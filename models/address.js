module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
     id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
     },
     userId: DataTypes.STRING,
     createdAt: DataTypes.DATE,
     updatedAt: DataTypes.DATE,
     location: DataTypes.JSON
  },{
    underscored: true,
  });
  return Address;
};