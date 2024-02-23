module.exports = (sequelize, DataTypes) => {
    const ProductBuy = sequelize.define("ProductBuy", {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
    },{
        underscored: true,
    });
  
    return ProductBuy;
};