module.exports = (sequelize, Sequelize) => {
    const CompositionList = sequelize.define("CompositionList", {
        id:{
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.DataTypes.STRING,
    },{
        underscored: true,
    });
    return CompositionList;
};