module.exports = (sequelize, DataTypes) => {
    const Bidding = sequelize.define("ProductBidding", {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        price: {type: DataTypes.INTEGER}
    },{
        underscored: true,
    });
  
    return Bidding;
};