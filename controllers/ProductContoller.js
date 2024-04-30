const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");
let SellerAuh = require("../middlewares/sellerAuth");
let BuyerAuh = require("../middlewares/buyersAuth");
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
  // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
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
    SellerAuh,
    async (req, res) => {
    try{
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              res.status(400).send('Multer error: ' + err.message);
            } 
            else if (err) {
              res.status(500).send('Unknown error: ' + err.message);
            } 
            else if (!req.body.productType) {
              return apiResponse.ErrorResponse(res, "Product type is required")
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
                
                if(req.body.disease){
                  if(typeof req.body.disease == "string"){
                    try{
                        req.body.disease = JSON.parse(req.body.disease)
                    }
                    catch(err){
                      return apiResponse.ErrorResponse(res, "Please make sure to stringify disease before send")
                    }
                  }
                  else{
                    return apiResponse.ErrorResponse(res, "Please make sure to stringify disease before send")
                  }
                }

                let product;
                let productKey;
                if(!req.body.isAlreadyExists){
                  if(req.body.productType == "Seed" || req.body.productType == "Seed Varieties"){
                      console.log("Seeds")
                      req.body.productType = "Seed Varieties"
                      product = await Models.SeedProducts.create({
                          name: req.body.name,
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
                          description: req.body.description,
                          ProductType:  req.body.productType,
                          image: images,
                          isVerified: false,
                          seedAddedBy: req.user.id
                      })
                      .catch((e) => { console.error(e.message) })
                  }
                  else if(req.body.productType == "Machinary & Tools"){
                    console.log("Machinary & Tools")
                      product = await Models.MachineryProduct.create({
                          name: req.body.name,
                          brand: req.body.brand,
                          horsePower: req.body.horsePower,
                          model: req.body.model,
                          condition: req.body.condition,
                          image: images,
                          discount: req.body.discount,
                          description: req.body.description,
                          type: req.body.type,
                          ProductType:  req.body.productType,
                          isVerified: false,
                          machineAddedBy: req.user.id
                      })
                      .catch((e) => { console.error(e.message) })
                  }
                  else{
                      console.log("Common")
                      product = await Models.Product.create({
                          name: req.body.name,
                          brand:  req.body.brand,
                          description:  req.body.description,
                          pkgType:  req.body.pkgType,
                          weightUnit: req.body.weightUnit,
                          pkgWeight:  req.body.pkgWeight,
                          pkgQuantity:  req.body.pkgQuantity,
                          ProductType: req.body.productType,
                          description: req.body.description,
                          category: req.body.category,
                          formType: req.body.formType,
                          image: images,
                          isVerified: false,
                          subProductType: req.body.subProductType,
                          areaCovered: req.body.areaCovered,
                          disease: req.body.disease,
                          expiryDate: req.body.expiryDate,
                          addedBy: req.user.id
                      })
                      .catch((e) => { console.error(e.message) })

                      if(req.body.composition && req.body.composition.length > 0){
                        for await(let comp of req.body.composition){
                          await Models.Composition.create({
                            name: comp.name,
                            unit: comp.unit,
                            volume: comp.volume,
                            productId: product.id
                          })
                        }
                      }
                  }
                }
                else{
                  if(req.body.productType == "Seed" || req.body.productType == "Seed Varieties"){
                    productKey = "seedProductId";
                    product = await Models.SeedProducts.findOne({
                      where: { id: req.body.productId},
                    });
                  }
                  else if(req.body.productType == "Machinary & Tools"){
                    productKey = "mtProductId";
                    product = await Models.MachineryProduct.findOne({
                      where: { id: req.body.productId},
                    });
                  }
                  else{
                    productKey = "productId";
                    product = await Models.Product.findOne({
                      where: { id: req.body.productId},
                    });
                  }
                  if(!product){
                    return apiResponse.successResponse(res, "Main Product not found")
                  }
                  console.log(req.user.id)
                  await Models.ListingProduct.create({
                    [productKey]: product.id,
                    shelfLifeStart:  req.body.shelfLifeStart,
                    availableFrom:  req.body.availableFrom,
                    shelfLifeEnd:  req.body.shelfLifeEnd,
                    bidding:  req.body.bidding,
                    price:  req.body.price,
                    ProductType:  req.body.productType,
                    owner: req.user.id,
                    addressId: (req.body.addressId) ? JSON.parse(req.body.addressId) : []
                  })
                  .catch((e) => { console.error(e.message) })
                }
                
                return apiResponse.successResponse(res,"Product Stored Sucessfully")
            }
        })
    }
    catch(err){
         console.log(err);
         return apiResponse.ErrorResponse(res, "Something went wrong");
    }
}];

exports.deleteProduct = [
  async (req, res) => {
  try{
    if(req.query.type == "seed"){
      await Models.SeedProducts.destroy({
        where : {id:req.params.id}
      })
    }
    else if(req.query.type == "machine"){
      await Models.MachineryProduct.destroy({
        where : {id:req.params.id}
      })
    }
    else{
      await Models.Product.destroy({
        where : {id:req.params.id}
      })
    }
    
    return apiResponse.successResponse(res, "Deleted Sucessfully")
  }catch(err){
    console.log(err)
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]

exports.getProductLisingsWRTType = [
    async (req, res) => {
    try{
      // const { limit = 20, skip = 0 } = req.query;
      if (!req.body.productType) {
        return apiResponse.ErrorResponse(res, "Product type is required")
      } 

      let allProducts = await Models.ListingProduct.findAll({
        where: { ProductType:req.body.productType},
        include: [
          {
            model: Models.Product,
            as: "product"
          },
          {
            model: Models.MachineryProduct,
            as: "machineryProduct"
          }, 
          {
            model: Models.SeedProducts,
            as: "seedProducts"
          }  
        ],
        // limit: parseInt(limit),
        // offset: parseInt(skip),
        order: [['createdAt', 'DESC']]
      });

      let listingProducts = [];
      allProducts.forEach(prop =>{
        let x = prop.dataValues;
        let temp;
        if(x.seedProducts){
          temp = {...x.seedProducts.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.machineryProduct){
          temp = {...x.machineryProduct.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.product){
          temp = {...x.product.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }

        if(temp){
          delete x.product;
          delete x.machineryProduct;
          delete x.seedProducts;

          listingProducts.push({...x, ...temp})
        }
      })


      return apiResponse.successResponseWithData(res, "data", listingProducts)
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.getProductLisings = [
    async (req, res) => {
    try{
      // const { limit = 20, skip = 0 } = req.query;

      let allProducts = await Models.ListingProduct.findAll({
        where: {},
        include: [
          {
            model: Models.Product,
            as: "product"
          },
          {
            model: Models.MachineryProduct,
            as: "machineryProduct",
            required: false
          }, 
          {
            model: Models.SeedProducts,
            as: "seedProducts"
          } 
        ],
        // limit: parseInt(limit),
        // offset: parseInt(skip),
        order: [['createdAt', 'DESC']]
      });

      let listingProducts = [];
      allProducts.forEach(prop =>{
        let x = prop.dataValues;
        let temp;
        if(x.seedProducts){
          temp = {...x.seedProducts.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.machineryProduct){
          temp = {...x.machineryProduct.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.product){
          temp = {...x.product.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }

        if(temp){
          delete x.product;
          delete x.machineryProduct;
          delete x.seedProducts;

          listingProducts.push({...x, ...temp})
        }
      })

      return apiResponse.successResponseWithData(res, "data", listingProducts)
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.getMyProduct = [
  SellerAuh,
    async (req, res) => {
    try{
      // const { limit = 20, skip = 0 } = req.query;

      let allProducts = await Models.ListingProduct.findAll({
        where:{owner:req.user.id},
        include: [
          {
            model: Models.Product,
            as: "product"
          },
          {
            model: Models.MachineryProduct,
            as: "machineryProduct"
          }, 
          {
            model: Models.SeedProducts,
            as: "seedProducts"
          }  
        ],
        // limit: parseInt(limit),
        // offset: parseInt(skip),
        order: [['createdAt', 'DESC']]
      });

      let listingProducts = [];
      allProducts.forEach(prop =>{
        let x = prop.dataValues;
        let temp;
        if(x.seedProducts){
          temp = {...x.seedProducts.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.machineryProduct){
          temp = {...x.machineryProduct.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.product){
          temp = {...x.product.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }

        if(temp){
          delete x.product;
          delete x.machineryProduct;
          delete x.seedProducts;

          listingProducts.push({...x, ...temp})
        }
      })


      return apiResponse.successResponseWithData(res, "data", listingProducts)
    }catch(err){
      console.log(err)
      return apiResponse.ErrorResponse(res, "Something went wrong")
    }
}]

exports.getUserProduct = [
    async (req, res) => {
    try{
      // const { limit = 20, skip = 0 } = req.query;

      let allProducts = await Models.ListingProduct.findAll({
        where:{owner:req.params.id},
        include: [
          {
            model: Models.Product,
            as: "product"
          },
          {
            model: Models.MachineryProduct,
            as: "machineryProduct"
          }, 
          {
            model: Models.SeedProducts,
            as: "seedProducts"
          }  
        ],
        // limit: parseInt(limit),
        // offset: parseInt(skip),
        order: [['createdAt', 'DESC']]
      });

      let listingProducts = [];
      allProducts.forEach(prop =>{
        let x = prop.dataValues;
        let temp;
        if(x.seedProducts){
          temp = {...x.seedProducts.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.machineryProduct){
          temp = {...x.machineryProduct.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }
        else if(x.product){
          temp = {...x.product.dataValues}
          delete temp.id;
          delete createdAt;
          delete updatedAt;
        }

        if(temp){
          delete x.product;
          delete x.machineryProduct;
          delete x.seedProducts;

          listingProducts.push({...x, ...temp})
        }
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
          include: [{
            model: Models.User,
            as: "user", // Use the default alias assigned by Sequelize
            attributes: { exclude: ['otp','otpTries','otpExpiry','status'] }
          },
          {
            model: Models.Product,
            as: "product",
            include: {
              model: Models.Composition,
              as: "composition", // Use the default alias assigned by Sequelize
            }
          },
          {
            model: Models.MachineryProduct,
            as: "machineryProduct",
            required: false
          }, 
          {
            model: Models.SeedProducts,
            as: "seedProducts"
          }]
        });


        if(listing){
          let product;
          let composition = [];
          if(listing.seedProducts){
            product = {...listing.seedProducts};
          }
          else if(listing.machineryProduct){
            product = {...listing.machineryProduct};
          }
          else{
            product = {...listing.product};
          }

          if(!product){
            return apiResponse.ErrorResponse(res, "Product not found")
          }

          let mainPro = {...product.dataValues};
          delete mainPro.id;
          
          if(mainPro.composition && mainPro.composition.length > 0){
            composition = [...mainPro.composition]
          }

          address = [];

          if(listing.addressId && listing.addressId.length > 0){
            address = await Models.Address.findAll({
              where: {
                id: listing.addressId
              }
            })
          }

          let final = {...listing.dataValues, ...mainPro, composition, address};
          delete final.productId;
          delete final.owner;
          delete final.addressId
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
    async (req, res) => {
    try {
      let filter =  {
          name: {
            [Op.iLike]: `%${req.body.query}%` // Case-insensitive search
          },
          isVerified: true
      }
      
      let products;
      if(req.body.productType || req.body.category){
        if(req.body.category){
          req.body.productType = req.body.category
        }
        
        if(req.body.productType == "Seed" || req.body.productType == "Seed Varieties"){
          products = await Models.SeedProducts.findAll({
            where: filter,
            order: [['createdAt', 'DESC']]
          });
        }
        else if(req.body.productType == "Machinary & Tools"){
          products = await Models.MachineryProduct.findAll({
            where: filter,
            order: [['createdAt', 'DESC']]
          });
        }
        else {
          filter.ProductType = req.body.productType;
          products = await Models.Product.findAll({
            where: filter,
            order: [['createdAt', 'DESC']],
            include: {
              model: Models.Composition,
              as: "composition", // Use the default alias assigned by Sequelize
            },
          });
        }
      }
      else{
        const seeds = await Models.SeedProducts.findAll({
          where: filter,
          order: [['createdAt', 'DESC']]
        });
  
        const machinary = await Models.MachineryProduct.findAll({
          where: filter,
          order: [['createdAt', 'DESC']]
        });

        if(req.body.productType){
          filter.ProductType = req.body.productType;
        }
        if(req.body.category){
          filter.ProductType = req.body.category;
        }
  
        const common = await Models.Product.findAll({
          where: filter,
          order: [['createdAt', 'DESC']],
          include: {
            model: Models.Composition,
            as: "composition", // Use the default alias assigned by Sequelize
          },
        });
  
        products = [];
        if(common) products.push(...common)
        if(seeds) products.push(...seeds)
        if(machinary) products.push(...machinary)
      }
      return apiResponse.successResponseWithData(res, "Search Result", products)
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]

exports.requestProduct = [
  BuyerAuh,
  async (req, res) => {
  try {
    let {productId} = req.body;

    if(!productId){
      return apiResponse.ErrorResponse(res,"Product Id is missing");
    }

    let pro = await Models.ListingProduct.findOne({
      where: {id: productId}
    });

    if(!pro){
        return apiResponse.ErrorResponse(res,"Product not found");
    }
    else if(pro.owner == req.user.id){
      return apiResponse.ErrorResponse(res,"You can not buy your own product");
    }
    else{
      let buy = await Models.ProductRequest.findOne({
        where: {id: productId}
      });

      if(buy){
        return apiResponse.ErrorResponse(res,"You have already buyed this Product");
      }
      else{
        await Models.ProductRequest.create({
          listingId: pro.id,
          userId: req.user.id
        });
        return apiResponse.successResponse(res,"Product purchased sucessfully");
      }
    }
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]

exports.biddingProduct = [
  BuyerAuh,
  async (req, res) => {
  try {
    let {productId, price} = req.body;

    if(!price || !productId){
      return apiResponse.ErrorResponse(res,"Product Id or Price is missing");
    }

    let pro = await Models.ListingProduct.findOne({
      where: {id: productId}
    });

    if(!pro){
        return apiResponse.ErrorResponse(res,"Product not found");
    }
    else if(pro.owner == req.user.id){
      return apiResponse.ErrorResponse(res,"You can not bid on your own product");
    }
    else if(!pro.bidding){
        return apiResponse.ErrorResponse(res,"Product has no bidding option");
    }
    else{
      let buy = await Models.ProductBidding.findOne({
        where: {id: productId}
      });

      if(buy){
        return apiResponse.ErrorResponse(res,"You have already bidding on this product");
      }
      else{
        await Models.ProductBidding.create({
          listingId: pro.id,
          price,
          userId: req.user.id
        });
        return apiResponse.successResponse(res,"Bidding on this product sucessfully");
      }
    }
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]

exports.productRequests = [
  SellerAuh,
  async (req, res) => {
  try{
    let listing = await Models.ListingProduct.findAll({
      where: { owner: req.user.id },
      include: [{
        model: Models.ProductRequest,
        as: "request", // Use the default alias assigned by Sequelize
        include: {
          model: Models.User,
          as: "user", // Use the default alias assigned by Sequelize
          attributes: { exclude: ['otp', 'otpTries', 'otpExpiry', 'status'] },
        },
        required: true // This ensures that only listings with bidders are returned
      }]
    });
        
      return apiResponse.successResponseWithData(res, "Product Request", listing);
  }catch(err){
    console.log(err)
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]

exports.productBidders = [
  SellerAuh,
  async (req, res) => {
  try{
      let listing = await Models.ListingProduct.findAll({
        where: {owner:req.user.id},
        include: [{
          model: Models.ProductBidding,
          as: "bidders", // Use the default alias assigned by Sequelize
          include: {
            model: Models.User,
            as: "user", // Use the default alias assigned by Sequelize
            attributes: { exclude: ['otp','otpTries','otpExpiry','status'] },
          },
          required: true // This ensures that only listings with bidders are returned
        }]
      });
      
      return apiResponse.successResponseWithData(res, "Product Bidders", listing);
  }catch(err){
    console.log(err)
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]

exports.analyticProduct = [
  SellerAuh,
  async (req, res) => {
  try{
      let totalProducts = await Models.ListingProduct.findAll({
        where: {owner: req.user.id},
        attributes:["id"]
      });

      let ids = [];

      totalProducts.forEach(x => ids.push(x.id));

      let totalBids = await Models.ProductBidding.count({
        where: {
          listingId:{
            [Op.in]: ids
          }
        }
      })

      let totalRequest = await Models.ProductRequest.count({
        where: {
          listingId:{
            [Op.in]: ids
          }
        }
      })

      return apiResponse.successResponseWithData(res, "Analytics",{
        totalProducts: totalProducts.length,
        totalBids,
        totalRequest
      })

  }catch(err){
    console.log(err)
    return apiResponse.ErrorResponse(res, "Something went wrong")
  }
}]