module.exports = (sequelize, Sequelize) => {
    const ProductRequest = sequelize.define("ProductRequest", {
        id:{
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
    },{
        underscored: true,
    });
  
    return ProductRequest;
};