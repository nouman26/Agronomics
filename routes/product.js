var express = require("express");
var Controller = require("../controllers/index");
var router = express.Router();

router.post("/add",Controller.ProductController.addProduct);
router.get("/listings",Controller.ProductController.getProductLisings);
router.get("/listings/:category",Controller.ProductController.getProductLisingsWRTType);
router.get("/my",Controller.ProductController.getMyProduct);
router.get("/user/:id",Controller.ProductController.getUserProduct);
router.get("/details/:id",Controller.ProductController.getProducDetails);
router.post("/search",Controller.ProductController.search);
router.post("/buy",Controller.ProductController.buyProduct);
router.post("/bid",Controller.ProductController.biddingProduct);
router.get("/buyers",Controller.ProductController.ProductBuyers);
router.get("/bidders",Controller.ProductController.ProductBidders);
router.get("/analytic",Controller.ProductController.AnalyticProduct);
module.exports = router;