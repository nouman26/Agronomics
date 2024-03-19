module.exports = (sequelize, DataTypes) => {
    const ListingProducts = sequelize.define("ListingProduct", {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        shelfLifeStart: DataTypes.DATEONLY,
        availableFrom: DataTypes.DATEONLY,
        shelfLifeEnd: DataTypes.DATEONLY,
        bidding: DataTypes.STRING,
        price:  DataTypes.INTEGER,
        ProductType: DataTypes.STRING,
        name: DataTypes.STRING,
        addressId: DataTypes.ARRAY(DataTypes.INTEGER)
    },{
        underscored: true,
      });
  
    return ListingProducts;
  };
  