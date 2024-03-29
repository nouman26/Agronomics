module.exports = (sequelize, Sequelize) => {
    const ListingProducts = sequelize.define("ListingProduct", {
        id:{
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        shelfLifeStart: Sequelize.DataTypes.DATEONLY,
        availableFrom: Sequelize.DataTypes.DATEONLY,
        shelfLifeEnd: Sequelize.DataTypes.DATEONLY,
        bidding: Sequelize.DataTypes.STRING,
        price:  Sequelize.DataTypes.INTEGER,
        ProductType: Sequelize.DataTypes.STRING,
        name: Sequelize.DataTypes.STRING,
        addressId: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.INTEGER)
    },{
        underscored: true,
      });
  
    return ListingProducts;
  };
  