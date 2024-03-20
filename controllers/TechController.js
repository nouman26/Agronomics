const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");
let TechAuth = require("../middlewares/techAuth");
const multer = require('multer');

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
    TechAuth,
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
                if (req.files && req.files.length > 0) {
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
                
                if(req.body.productType == "Seed"){
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
                          image: images,
                          isVerified: true,
                          addedBy: req.user.id
                      });
                }
                else if(req.body.productType == "Machinary & Tools"){
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
                          isVerified: true,
                          addedBy: req.user.id
                      });
                }
                else{
                      product = await Models.Product.create({
                          name: req.body.name,
                          brand:  req.body.brand,
                          description:  req.body.description,
                          pkgType:  req.body.pkgType,
                          weightUnit: req.body.weightUnit,
                          pkgWeight:  req.body.pkgWeight,
                          pkgQuantity:  req.body.pkgQuantity,
                          ProductType: req.body.ProductType,
                          category: req.body.category,
                          formType: req.body.formType,
                          image: images,
                          isVerified: true,
                          addedBy: req.user.id
                      })

                      if(req.body.composition && req.body.composition.length > 0){
                        for await(let comp of req.body.composition){
                          await Models.Composition.create({
                            name: comp.name,
                            productId: product.id
                          })
                        }
                      }
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

exports.updateProduct = [
  TechAuth,
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
              if (req.files && req.files.length > 0) {
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
              
              if(req.body.productType == "Seed"){
                    await Models.SeedProducts.update({
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
                        image: images
                    },{
                      where: {id: req.body.productId}
                    });
              }
              else if(req.body.productType == "Machinary & Tools"){
                    await Models.MachineryProduct.update({
                        name: req.body.name,
                        brand: req.body.brand,
                        horsePower: req.body.horsePower,
                        model: req.body.model,
                        condition: req.body.condition,
                        image: images,
                        discount: req.body.discount,
                        description: req.body.description,
                        type: req.body.type
                    },{
                      where: {id: req.body.productId}
                    });
              }
              else{
                    await Models.Product.create({
                        name: req.body.name,
                        brand:  req.body.brand,
                        description:  req.body.description,
                        pkgType:  req.body.pkgType,
                        weightUnit: req.body.weightUnit,
                        pkgWeight:  req.body.pkgWeight,
                        pkgQuantity:  req.body.pkgQuantity,
                        ProductType: req.body.ProductType,
                        category: req.body.category,
                        formType: req.body.formType,
                        image: images,
                    })

                    if(req.body.composition && req.body.composition.length > 0){
                      await Models.Composition.destroy({where: {productId: req.body.productId}})

                      for await(let comp of req.body.composition){
                        await Models.Composition.create({
                          name: comp.name,
                          productId: product.id
                        })
                      }
                    }
              }
              
              return apiResponse.successResponse(res,"Product Updated Sucessfully")
          }
      })
  }
  catch(err){
       console.log(err);
       return apiResponse.ErrorResponse(res, "Something went wrong");
  }
}];

exports.approveProduct = [
  TechAuth,
  async (req, res) => {
  try{
    if(!req.body.productId || !req.body.productType){
      return apiResponse.ErrorResponse(res,"Product Id is required");
    }
    
    if(req.body.productType == "Seed"){
      product = await Models.SeedProducts.findOne(
        {isVerified: true},
        {where: { id: req.body.productId}},
      );
    }
    else if(req.body.productType == "Machinary & Tools"){
      product = await Models.MachineryProduct.findOne(
        {isVerified: true},
        {where: { id: req.body.productId}}
        );
    }
    else{
      product = await Models.Product.findOne(
        {isVerified: true},
        {where: { id: req.body.productId}},
      );
    }

    return apiResponse.successResponse(res, "Product Verified Sucessfully");
  }
  catch(err){
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
}
}];

exports.getProductsWRToType = [
  TechAuth,
  async (req, res) => {
  try{
    let product;
    let filter = {};
    if(req.body.status && req.body.status.toLowerCase() == "verified"){
      filter.isVerified = true;
    }
    else if(req.body.status && req.body.status.toLowerCase() == "unverified"){
      filter.isVerified = false;
    }

    if(req.body.productType == "Seed"){
      product = await Models.MachineryProduct.findAll({
        where: filter,
        order: [['createdAt', 'DESC']],
        include: {
          model: Models.User,
          as: "user",
          attributes: { exclude: ['otp','otpTries','otpExpiry','status'] }
        },
      });
    }
    else if(req.body.productType == "Machinary & Tools"){
      product = await Models.MachineryProduct.findAll({
        where: filter,
        order: [['createdAt', 'DESC']],
        include: {
          model: Models.User,
          as: "user",
          attributes: { exclude: ['otp','otpTries','otpExpiry','status'] }
        },
      });
    }
    else{
      if(req.body.productType) {
        filter.ProductType = req.body.productType
      }
      
      product = await Models.Product.findAll({
        where: filter,
        order: [['createdAt', 'DESC']],
        include: {
          model: Models.User,
          as: "user",
          attributes: { exclude: ['otp','otpTries','otpExpiry','status'] }
        },
      });
    }
    return apiResponse.successResponseWithData(res, "Product Fetched Sucessfully", product);
  }
  catch(err){
    console.log(err);
    return apiResponse.ErrorResponse(res, "Something went wrong");
  }
}];

exports.addComposition = [
  async (req, res) => {
    try{
      if(!req.body.name){
        return apiResponse.ErrorResponse(res, "Composition Name is required")
      }

      await Models.CompositionList.create({name: req.body.name});
      return apiResponse.successResponse(res, "Added Sucessfully");
    }
    catch(err){
      console.log(err);
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
}]

exports.updateComposition = [
  async (req, res) => {
    try{
      if(!req.body.name || !req.body.id){
        return apiResponse.ErrorResponse(res, "Composition Name or Id is missing")
      }

      await Models.CompositionList.update(
        {name: req.body.name},
        {where: {id: req.body.id}}
      );
      return apiResponse.successResponse(res, "Updated Sucessfully");
    }
    catch(err){
      console.log(err);
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
}]

exports.deleteComposition = [
  async (req, res) => {
    try{
      if(!req.body.id){
        return apiResponse.ErrorResponse(res, "Id is missing")
      }

      await Models.CompositionList.destroy(
        {where: {id: req.body.id}}
      );
      return apiResponse.successResponse(res, "Deleted Sucessfully");
    }
    catch(err){
      console.log(err);
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
}]


exports.GetComposition = [
  async (req, res) => {
    try{
      let data = await Models.CompositionList.findAll(
        {where: {}}
      );
      return apiResponse.successResponseWithData(res, "Fetched Sucessfully", data);
    }
    catch(err){
      console.log(err);
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
}]