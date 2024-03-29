module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("Admin", {
        id:{
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {type: Sequelize.DataTypes.STRING},
        email: {type: Sequelize.DataTypes.STRING},
        password: {type: Sequelize.DataTypes.STRING}
    },{
        underscored: true,
    });
  
    return Admin;
};