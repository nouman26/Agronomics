var express = require("express");
var Controller = require("../controllers/index");
var router = express.Router();

router.post("/add",Controller.ProductController.addProduct);
router.get("/listings",Controller.ProductController.getProductLisings);
router.get("/listings/:category",Controller.ProductController.getProductLisingsWRTType);
router.get("/my",Controller.ProductController.getMyProduct);
router.get("/get",Controller.ProductController.getProduct);
router.get("/details/:id",Controller.ProductController.getProducDetails);
router.post("/search",Controller.ProductController.search);
module.exports = router;