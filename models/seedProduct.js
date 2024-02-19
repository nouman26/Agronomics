module.exports = (sequelize, DataTypes) => {
    const Seeds = sequelize.define('SeedProducts', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        brand: DataTypes.STRING,
        seed: DataTypes.STRING,
        seedVariety: DataTypes.STRING,
        seedType: DataTypes.STRING,
        suitableRegion: DataTypes.STRING,
        seedWeight: DataTypes.FLOAT,
        pkgType: DataTypes.STRING,
        weightUnit: DataTypes.STRING,
        pkgWeight: DataTypes.FLOAT,
        pkgQuantity: DataTypes.INTEGER,
        tax: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        shipping: DataTypes.STRING,
        image: DataTypes.JSON
    },{
        underscored: true,
      });
  
    return Seeds;
  };
  