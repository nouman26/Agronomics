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
        type: DataTypes.STRING,
        condition: DataTypes.STRING,
        image: DataTypes.JSON,
        discount: DataTypes.FLOAT,
        description: DataTypes.STRING,
        isVerified: DataTypes.BOOLEAN,
    },{
        underscored: true,
      });
  
    return Machinery;
  };
  