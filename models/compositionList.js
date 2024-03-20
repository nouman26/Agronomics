module.exports = (sequelize, DataTypes) => {
    const CompositionList = sequelize.define("CompositionList", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
    },{
        underscored: true,
    });
    return CompositionList;
};