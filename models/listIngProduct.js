module.exports = (sequelize, DataTypes) => {
    const ListingProducts = sequelize.define("ListingProduct", {
        id:{
            type: DataTypes.STRING,
            primaryKey: true
        },
        productId:DataTypes.STRING,
        shelfLifeStart: DataTypes.STRING,
        availableFrom: DataTypes.STRING,
        shelfLifeEnd: DataTypes.STRING,
        bidding: DataTypes.STRING,
        shipping: DataTypes.STRING,
        price:  DataTypes.INTEGER,
        tax:  DataTypes.STRING,
        brand: DataTypes.STRING,
        ProductType: DataTypes.STRING,
        image: DataTypes.JSON,
        owner:DataTypes.STRING,
    },{
        underscored: true,
      });
  
    return ListingProducts;
  };
  