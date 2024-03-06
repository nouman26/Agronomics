module.exports = (sequelize, DataTypes) => {
    const Machinery = sequelize.define('MachineryProduct', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        brand: DataTypes.STRING,
        name: DataTypes.STRING,
        horsePower: DataTypes.FLOAT,
        model: DataTypes.STRING,
        condition: DataTypes.STRING,
        image: DataTypes.JSON,
        price: DataTypes.INTEGER,
        discount: DataTypes.FLOAT,
        description: DataTypes.STRING,
    },{
        underscored: true,
      });
  
    return Machinery;
  };
  