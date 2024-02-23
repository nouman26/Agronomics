var express = require("express");
var Controller = require("../controllers/index");
var router = express.Router();

router.post("/password/less/login",Controller.AuthController.passwordLessLogin);
router.post("/verify/otp",Controller.AuthController.verifyOtp);
router.post("/update/profile", Controller.AuthController.profileUpdate);
router.get("/profile", Controller.AuthController.profile);
router.post("/update/address", Controller.AuthController.updateAddress);
router.post("/delete/address", Controller.AuthController.deleteAddress);
router.get("/address", Controller.AuthController.address);
router.get("/all/user", Controller.AuthController.allUser);
router.post("/change/avatar", Controller.AuthController.changeAvatar);

module.exports = router;