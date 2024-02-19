const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");
let auth = require("../middlewares/jwt");
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/products")) // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Renaming uploaded files to avoid naming conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer upload limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
}).array('images', 4);

exports.addProduct = [
    auth,
    async (req, res) => {
    try{
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              res.status(400).send('Multer error: ' + err.message);
            } 
            else if (err) {
              res.status(500).send('Unknown error: ' + err.message);
            } 
            else {
                let images = [];
                if (req.files && 
                  req.files.length > 0) {
                    req.files.forEach((file) => images.push(`/images/products/${file.filename}`));
                }

                if(req.body.composition){
                  if(typeof req.body.composition == "string"){
                    try{
                        req.body.composition = JSON.parse(req.body.composition)
                    }
                    catch(err){
                      return apiResponse.ErrorResponse(res, "Please make sure to stringify composition before send")
                    }
                  }
                  else{
                    return apiResponse.ErrorResponse(res, "Please make sure to stringify composition before send")
                  }
                }
                
                let product;
                if(req.body.productType == "Seed"){
                    product = await Models.SeedProducts.create({
                        brand: req.body.brand,
                        seed: req.body.seed,
                        seedVariety: req.body.seedVariety,
                        seedType: req.body.seedType,
                        suitableRegion: req.body.suitableRegion,
                        seedWeight: req.body.seedWeight,
                        pkgType: req.body.pkgType,
                        weightUnit: req.body.weightUnit,
                        pkgWeight: req.body.pkgWeight,
                        pkgQuantity: req.body.pkgQuantity,
                        tax: req.body.tax,
                        price: req.body.price,
                        shipping: req.body.shipping,
                        image: images
                    });
                }
                else if(req.body.productType == "Machinary"){
                    product = await Models.MachineryProduct.create({
                        name: req.body.name,
                        horsePower: req.body.horsePower,
                        model: req.body.model,
                        condition: req.body.condition,
                        image: images,
                        price: req.body.price,
                        discount: req.body.discount,
                        description: req.body.description
                    });
                }
                else if(!req.body.isAlreadyExists){
                    product = await Models.Product.create({
                        name: req.body.name,
                        description:  req.body.description,
                        pkgType:  req.body.pkgType,
                        weightUnit: req.body.weightUnit,
                        pkgWeight:  req.body.pkgWeight,
                        pkgQuantity:  req.body.pkgQuantity,
                        ProductType: req.body.ProductType,
                        category: req.body.category,
                        formType: req.body.formType
                    })

                    if(req.body.composition && req.body.composition.length > 0){
                      for await(let comp of req.body.composition){
                        await Models.Composition.create({
                          name: comp.name,
                          value: comp.value,
                          productId: product.id
                        })
                      }
                    }
                }
                else{
                    product = await Models.User.findOne({
                        where: { id: req.body.productId},
                   });
                }

                await Models.ListingProduct.create({
                    name: req.body.name,
                    productId: product.id,
                    shelfLifeStart:  req.body.shelfLifeStart,
                    availableFrom:  req.body.availableFrom,
                    shelfLifeEnd:  req.body.shelfLifeEnd,
                    bidding:  req.body.bidding,
                    shipping:  req.body.shipping,
                    price:  req.body.price,
                    tax:   req.body.tax,
                    brand:  req.body.brand,
                    ProductType:  req.body.ProductType,
                    image: images,
                    owner: req.user.id,
                })

                return apiResponse.successResponse(res,"Product Stored Sucessfully")
            }
        })
    }
    catch(err){
         console.log(err);
         return apiResponse.ErrorResponse(res, "Something went wrong");
    }
}];

exports.getProductLisingsWRTType = [
    async (req, res) => {
    try{
      const { limit = 20, skip = 0 } = req.query;

      if(req.body.params == "Seed"){
        listingProducts = await Models.ListingProduct.findAll({
          where: {ProductType:"Seed"},
          limit: parseInt(limit),
          offset: parseInt(skip),
          order: [['createdAt', 'DESC']]
        });
      }
      else if(req.body.params == "Machinary"){
        listingProducts = await Models.ListingProduct.findAll({
          where: {ProductType:"Machinary"},
          limit: parseInt(limit),
          offset: parseInt(skip),
          order: [['createdAt', 'DESC']]
        });
      }
      else{
        listingProducts = await Models.ListingProduct.findAll({
          where: { ProductType:req.params.category},
          limit: parseInt(limit),
          offset: parseInt(skip),
          order: [['createdAt', 'DESC']]
        });
      }

        return apiResponse.successResponseWithData(res, "data", listingProducts)
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.getProductLisings = [
    async (req, res) => {
    try{
      const { limit = 20, skip = 0 } = req.query;

      const listingProducts = await Models.ListingProduct.findAll({
        limit: parseInt(limit),
        offset: parseInt(skip),
        order: [['createdAt', 'DESC']]
      });

      return apiResponse.successResponseWithData(res, "data", listingProducts)
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.getMyProduct = [
  auth,
    async (req, res) => {
    try{
      const { limit = 20, skip = 0 } = req.query;

      const listingProducts = await Models.ListingProduct.findAll({
        where:{owner:req.user.id},
        limit: parseInt(limit),
        offset: parseInt(skip),
        order: [['createdAt', 'DESC']]
      });

      return apiResponse.successResponseWithData(res, "data", listingProducts)
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.getProducDetails = [
    async (req, res) => {
    try{
        let listing = await Models.ListingProduct.findOne({
          where: {id:req.params.id},
          include: {
            model: Models.User,
            as: "user", // Use the default alias assigned by Sequelize
            attributes: { exclude: ['otp','otpTries','otpExpiry','status'] },
            include: {
              model: Models.Address,
              as: "address" // Use the default alias assigned by Sequelize 
            }
          }
        });
        if(listing){
          let product;
          if(listing.productType == "Seed"){
            product = await listing.getSeedProducts();
          }
          else if(listing.productType == "Machinary"){
            product = await listing.getMachineryProduct();
          }
          else{
            product = await listing.getProduct();
          }

          let composition = await product.getComposition({
            attributes:["name","value"]
          });

          if(!product){
            return apiResponse.ErrorResponse(res, "Product not found")
          }

          let final = {...listing.dataValues, ...product.dataValues, composition};
          return apiResponse.successResponseWithData(res, "Product Details", final);
        }
        else{
            return apiResponse.ErrorResponse(res, "Product not found")
        }
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.search = [
    auth,
    async (req, res) => {
    try {
      let filter =  {
          name: {
            [Op.iLike]: `%${req.body.query}%` // Case-insensitive search
          }
      }
      if(req.body.productType){
        filter.ProductType = req.body.productType
      }
      const products = await Models.Product.findAll({
        where: filter,
        order: [['createdAt', 'DESC']]
      });
      return apiResponse.successResponseWithData(res, "Search Result", products)
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]