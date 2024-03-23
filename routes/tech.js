var express = require("express");
var Controller = require("../controllers/index");
var router = express.Router();

router.post("/add/product",Controller.TechController.addProduct);
router.post("/update/product",Controller.TechController.updateProduct);
router.post("/product/add/image",Controller.TechController.addProductImage);
router.post("/product/delete/image",Controller.TechController.deleteProductImage);
router.post("/all/products",Controller.TechController.getProductsWRToType);
router.post("/approve/product",Controller.TechController.approveProduct);

// Composition
router.post("/add/composition",Controller.TechController.addComposition);
router.post("/update/composition",Controller.TechController.updateComposition);
router.post("/delete/composition",Controller.TechController.deleteComposition);
router.get("/composition",Controller.TechController.GetComposition);
module.exports = router;