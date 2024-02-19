module.exports = (sequelize, DataTypes) => {
    const Composition = sequelize.define("Composition", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        value: DataTypes.FLOAT
    },{
        underscored: true,
    });
    return Composition;
};
  