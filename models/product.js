module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define("Product", {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        brand: DataTypes.STRING,
        name: DataTypes.STRING,
        description:  DataTypes.STRING,
        pkgType:  DataTypes.STRING,
        weightUnit: DataTypes.STRING,
        pkgWeight:  DataTypes.STRING,
        pkgQuantity:  DataTypes.STRING,
        ProductType: DataTypes.STRING,
        category: DataTypes.STRING,
        formType: DataTypes.STRING,
        isVerified: DataTypes.BOOLEAN,
        image: DataTypes.JSON
    },{
        underscored: true,
      });
  
    return Products;
  };
  