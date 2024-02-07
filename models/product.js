module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define("Product", {
        id:{
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description:  DataTypes.STRING,
        pkgType:  DataTypes.STRING,
        weightUnit: DataTypes.STRING,
        pkgWeight:  DataTypes.STRING,
        pkgQuantity:  DataTypes.STRING,
        ProductType: DataTypes.STRING,
        category: DataTypes.STRING,
        formType: DataTypes.STRING,
        compisitions: DataTypes.JSON
    },{
        underscored: true,
      });
  
    return Products;
  };
  