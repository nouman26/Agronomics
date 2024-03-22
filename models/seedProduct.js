module.exports = (sequelize, DataTypes) => {
    const Seeds = sequelize.define('SeedProducts', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: DataTypes.STRING,
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
        description: DataTypes.STRING,
        image: DataTypes.JSON,
        isVerified: DataTypes.BOOLEAN,
    },{
        underscored: true,
      });
  
    return Seeds;
  };
  