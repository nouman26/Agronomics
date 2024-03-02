module.exports = (sequelize, DataTypes) => {
    const ProductRequest = sequelize.define("ProductRequest", {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
    },{
        underscored: true,
    });
  
    return ProductRequest;
};