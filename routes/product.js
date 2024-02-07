var express = require("express");
var Controller = require("../controllers/index");
var router = express.Router();

router.post("/add",Controller.ProductController.addProduct);
router.get("/get",Controller.ProductController.getProduct);
module.exports = router;