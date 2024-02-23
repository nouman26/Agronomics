'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config) {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// =============== Relation Between Products and Product Listing ===============
db.Product.hasMany(db.ListingProduct, { as: "listingProduct", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })
db.ListingProduct.belongsTo(db.Product, { as: "product", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })

// =============== Relation Between Seed and Product Listing ===============
db.SeedProducts.hasOne(db.ListingProduct, { as: "listingProduct", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })
db.ListingProduct.belongsTo(db.SeedProducts, { as: "seedProducts", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })

// =============== Relation Between Machinary and Product Listing ===============
db.MachineryProduct.hasOne(db.ListingProduct, { as: "listingProduct", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })
db.ListingProduct.belongsTo(db.MachineryProduct, { as: "machineryProduct", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })

// =============== Relation Between Composition and Product ===============
db.Product.hasMany(db.Composition, { as: "composition", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })
db.Composition.belongsTo(db.Product, { as: "product", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "productId", allowNull: true } })

// =============== Relation Between User and Product Listing ===============
db.User.hasMany(db.ListingProduct, { as: "listingProduct", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "owner", allowNull: true } })
db.ListingProduct.belongsTo(db.User, { as: "user", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "owner", allowNull: true } })

// =============== Relation Between User and Address ===============
db.User.hasMany(db.Address, { as: "address", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "userId", allowNull: true } })
db.Address.belongsTo(db.User, { as: "user", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "userId", allowNull: true } })

// =============== Relation Between Product and Bidding ===============
db.ListingProduct.hasMany(db.ProductBidding, { as: "bidders", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "listingId", allowNull: true } })
db.ProductBidding.belongsTo(db.ListingProduct, { as: "product", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "listingId", allowNull: true } })

// =============== Relation Between Product and Product Sell ===============
db.ListingProduct.hasMany(db.ProductBuy, { as: "buyers", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "listingId", allowNull: true } })
db.ProductBuy.belongsTo(db.ListingProduct, { as: "product", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "listingId", allowNull: true } })

// =============== Relation Between User and Product Sell ===============
db.User.hasMany(db.ProductBuy, { as: "productbuy", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "userId", allowNull: true } })
db.ProductBuy.belongsTo(db.User, { as: "user", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "userId", allowNull: true } })

// =============== Relation Between User and Product Bidding ===============
db.User.hasMany(db.ProductBidding, { as: "bidding", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "userId", allowNull: true } })
db.ProductBidding.belongsTo(db.User, { as: "user", onDelete: "CASCADE", onUpdate: "CASCADE", foreignKey: { name: "userId", allowNull: true } })

module.exports = db;