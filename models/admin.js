module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING}
    },{
        underscored: true,
    });
  
    return Admin;
};