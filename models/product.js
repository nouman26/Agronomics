module.exports = (sequelize, Sequelize) => {
    const Products = sequelize.define("Product", {
        id:{
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid:{
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          unique: true,
          defaultValue: Sequelize.DataTypes.UUIDV4
        },
        brand: Sequelize.DataTypes.STRING,
        name: Sequelize.DataTypes.STRING,
        description:  Sequelize.DataTypes.STRING(2000),
        pkgType:  Sequelize.DataTypes.STRING,
        weightUnit: Sequelize.DataTypes.STRING,
        pkgWeight:  Sequelize.DataTypes.STRING,
        pkgQuantity:  Sequelize.DataTypes.STRING,
        ProductType: Sequelize.DataTypes.STRING,
        category: Sequelize.DataTypes.STRING,
        subProductType: Sequelize.DataTypes.STRING,
        formType: Sequelize.DataTypes.STRING,
        isVerified: Sequelize.DataTypes.BOOLEAN,
        image: Sequelize.DataTypes.JSON,
        areaCovered: Sequelize.DataTypes.FLOAT,
        expiryDate: Sequelize.DataTypes.DATEONLY,
        disease: Sequelize.DataTypes.JSON
    },{
        underscored: true,
      });
  
    return Products;
  };
  