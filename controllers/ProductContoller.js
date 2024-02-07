const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");
const validatePhone = require("../helpers/validatePhone");
const generateId = require("../helpers/generateId");
const randomNumber = require("../helpers/randomNumber");
const moment = require("moment");
const sendEmail = require("../helpers/sendEmail");
const sendMessage = require("../helpers/sendMessage");
const jwt = require("jsonwebtoken");
let auth = require("../middlewares/jwt");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products') // Destination folder for uploaded files
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
                    req.files.forEach((file) => images.push(`public/images/products/${file.filename}`));
                }
                let product;
                if(req.body.productType == "seed"){
                    product = await Models.SeedProducts.create({
                        id: await generateId(),
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
                        image: images,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
                else if(req.body.productType == "machinary"){
                    product = await Models.MachineryProduct.create({
                        id: await generateId(),
                        name: req.body.name,
                        horsePower: req.body.horsePower,
                        model: req.body.model,
                        condition: req.body.condition,
                        image: images,
                        price: req.body.price,
                        discount: req.body.discount,
                        description: req.body.description,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
                else if(!req.body.isAlreadyExists){
                    product = await Models.Product.create({
                        id: await generateId(),
                        name: req.body.name,
                        description:  req.body.description,
                        pkgType:  req.body.pkgType,
                        weightUnit: req.body.weightUnit,
                        pkgWeight:  req.body.pkgWeight,
                        pkgQuantity:  req.body.pkgQuantity,
                        ProductType: req.body.ProductType,
                        category: req.body.category,
                        formType: req.body.formType,
                        // compisitions: compositions
                    })
                }
                else{
                    product = await Models.User.findOne({
                        where: { id: req.body.productId},
                   });
                }

                await Models.ListingProduct.create({
                    id:await generateId(),
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

exports.getProduct = [
    auth,
    async (req, res) => {
    try{
        let listing = await Models.ListingProduct.findAll({
          where: {}
        });
        let product = await Models.Product.findAll({
          where: {}
        });

        return apiResponse.successResponseWithData(res, "data", {listing, product})
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]