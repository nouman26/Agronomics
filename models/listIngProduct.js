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
        shipping: DataTypes.STRING,
        price:  DataTypes.INTEGER,
        tax:  DataTypes.STRING,
        brand: DataTypes.STRING,
        ProductType: DataTypes.STRING,
        image: DataTypes.JSON
    },{
        underscored: true,
      });
  
    return ListingProducts;
  };
  