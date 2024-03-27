module.exports = (sequelize, DataTypes) => {
    const Composition = sequelize.define("Composition", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        unit: DataTypes.STRING,
        volume: DataTypes.STRING,
    },{
        underscored: true,
    });
    return Composition;
};
  