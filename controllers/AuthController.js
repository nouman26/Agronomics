const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");
const randomNumber = require("../helpers/randomNumber");
const moment = require("moment");
const sendMessage = require("../helpers/sendMessage");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const multer = require("multer");
let SellerAuh = require("../middlewares/sellerAuth");
const CommonAuth = require("../middlewares/commonAuth")
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let uploadFromBuffer = (req) => {
     return new Promise((resolve, reject) => {
       cloudinary.uploader.upload_stream({ folder: "avatars" }, (err, res) => {
           if (err) {
             console.log(err);
             reject(err);
           } else {
             // console.log(`Upload succeed: ${res}`);
             resolve(res);
           }
         }).end(req);
     });
};

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, "./public/avatars");
     },
     filename: (req, file, cb) => {
         console.log(file);
         cb(null, Date.now() + file.originalname);
     }
 });

 let sanitizedPhoneNumber = (str) => {
     //Filter only numbers from the input
     let cleaned = ("" + str).replace(/\D/g, "");
     
     if(cleaned.length == 0){
         return null;
     }
     else if(cleaned.length > 12){
          return null;
     }
     else if(cleaned.length == 11 && cleaned[0] == "0"){
         return cleaned;
     }
     else if(cleaned.length == 12 && cleaned[0] == "9"){
          return "0"+cleaned.substring(2);
     }
     else{
          return null;
     }
}
 
 const fileFilter = (req, file, cb) => {
     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/heif" || file.mimetype == "image/heic") {
         cb(null, true);
     } else {
         cb(null, false);
     }
 };
 
const upload = multer({storage: multer.memoryStorage(), fileFilter: fileFilter}).single("avatar");

exports.techLogin = [
     async (req, res) => {
     try{
          const {email, password} = req.body;
          if (!email || !password) return apiResponse.validationErrorWithData(res, "Email or Password is missing");
     
          let userData = await Models.Admin.findOne({
               where: { email: email.toLowerCase() },
          })

          if (!userData) {
               return apiResponse.unauthorizedResponse(res, "User not found");
          }
          else {
               let isCorrectPassword = await bcrypt.compare(password, userData.password);
               if (!isCorrectPassword) {
                    return apiResponse.unauthorizedResponse(res, "Incorrect Password");
               }
               else{
                    let tokenData = {
                         name: userData.name,
                         id: userData.id,
                         role: "admin"
                    };
                    
                    const jwtPayload = tokenData;
                    const jwtData = {
                        expiresIn: process.env.JWT_TIMEOUT_DURATION,
                    };
                    const secret = process.env.JWT_SECRET;
                    //Generated JWT token with Payload and secret.
                    Object.assign(tokenData, {token: jwt.sign(jwtPayload, secret, jwtData)});
                    return apiResponse.successResponseWithData(res, "Login Sucessfull", tokenData)
               }
          }
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.registerAdmin = [
     async (req, res) => {
     try{
          if(!req.body.password){
               return apiResponse.ErrorResponse(res, "Password is required");
          }
          let userData = await Models.Admin.findOne({
               where: { email: "admin@agronomics.pk" },
          });

          if (!userData) {
               userData = await Models.Admin.create({
                    name: "Agronomics Admin",
                    email: "admin@agronomics.pk",
                    password: await bcrypt.hash(req.body.password, 10)
               });
               return apiResponse.successResponse(res,"Registered Sucessfully");
          }
          else{
               return apiResponse.unauthorizedResponse(res, "Admin already exist");
          }
     }catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.passwordLessLogin = [
     async (req, res) => {
     try{
          let {phone, type} = req.body;
          if (!phone)
          return apiResponse.validationErrorWithData(res, "Please provide email or phone");
     
          phone = await sanitizedPhoneNumber(phone);

          if (!phone) {
               console.log("Invalid phone number", phone);
               return apiResponse.ErrorResponse(res, "Invalid phone number")
          }

          let userData = {};
          const otpExpiry = moment().add(10, "minutes").valueOf();
          let otp = await randomNumber(4);
          
          userData = await Models.User.findOne({
               where: { phone: phone },
          });
          let isBuyer = false;
          let isSeller = false;

          if(type == "seller"){
               isSeller = true;
          }

          if(type == "buyer"){
               isBuyer = true;
          }
          
          if (!userData) {
               userData = await Models.User.create({
                    phone: phone,
                    otp: otp,
                    role: type,
                    otpExpiry: otpExpiry,
                    isBuyer,
                    isSeller
               });
          }
          else {
               if(userData.isSeller){
                    isSeller = true;
               }
               if(userData.isBuyer){
                    isBuyer = true;
               }
               await Models.User.update({
                    otp: otp,
                    otpExpiry: otpExpiry,
                    otpTries: 0,
                    role: type,
                    isBuyer,
                    isSeller
               },
               {
                    where: { id: userData.id },
               });
          }
          
          // send otp to phone
          let { status, data} = await sendMessage(phone, `Your OTP for Agronomics is ${otp}. For any issue contact us 03217336243.`);
          if (status === 200 && data) {
               sendSuccess = true;
               return apiResponse.successResponseWithData(res, "OTP sent successfully to your phone",{
                    id: userData.id,
                    phone: userData.phone
               });
          }
          else {
               return apiResponse.ErrorResponse(res, "Something went wrong");
          }
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.switchRole = [
     CommonAuth,
     async (req, res) => {
     try{
          let userData = await Models.User.findOne({
               where: { id: req.user.id},
          });

          if (!userData) return apiResponse.validationErrorWithData(res, "User not found");
          await Models.User.update({
               role: req.user.role == "seller" ? "buyer" : "seller",
               isBuyer:true,
               isSeller:true
          },
          {
               where: { id: userData.id },
          });

          let tokenData = {
               id: userData.id,
               role: req.user.role == "seller" ? "buyer" : "seller"
          };
          
          const jwtPayload = tokenData;
          const jwtData = {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
          };
          const secret = process.env.JWT_SECRET;
          //Generated JWT token with Payload and secret.
          Object.assign(userData, {token: jwt.sign(jwtPayload, secret, jwtData)});
          let userJson = {
               id: userData.id,
               name: userData.name,
               phone: userData.phone,
               token: userData.token,
               isBuyer: true,
               isSeller: true,
               role: req.user.role == "seller" ? "buyer" : "seller"
          };
          return apiResponse.successResponseWithData(res, "Roll Switched Sucessfully", userJson);
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.verifyOtp = [
     async (req, res) => {
     try{
          const { otp, id } = req.body;

          if (isNaN(parseInt(id))) return apiResponse.validationErrorWithData(res, "Please provide valid id");
          if (!otp) return apiResponse.validationErrorWithData(res, "Please provide otp");
          if (!id) return apiResponse.validationErrorWithData(res, "Please provide id");
          let userData = await Models.User.findOne({
               where: { id: id},
          });

          if (!userData) return apiResponse.validationErrorWithData(res, "User not found");
          if (parseInt(userData.otp) !== parseInt(otp)){
               await Models.User.update({
                    updatedAt: new Date(),
                    otpTries: userData.otpTries ? parseInt(userData.otpTries) + 1 : 1,
               },
               {
                    where: { id: userData.id },
               });
               return apiResponse.validationErrorWithData(res, "OTP not matched");
          }

          if (userData.otpExpiry < moment().valueOf()) return apiResponse.validationErrorWithData(res, "OTP expired");
          if(userData.otpTries >= 3) return apiResponse.validationErrorWithData(res, "OTP tries exceeded");
          await Models.User.update({
               updatedAt: new Date(),
               otp: null,
               otpExpiry: null,
          },
          {
               where: { id: userData.id },
          });

          let tokenData = {
               id: userData.id,
               role: userData.role
          };
          
          const jwtPayload = tokenData;
          const jwtData = {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
          };
          const secret = process.env.JWT_SECRET;
          //Generated JWT token with Payload and secret.
          Object.assign(userData, {token: jwt.sign(jwtPayload, secret, jwtData)});
          let userJson = {
               id: userData.id,
               name: userData.name,
               phone: userData.phone,
               token: userData.token,
               isBuyer: userData.isBuyer,
               isSeller: userData.isSeller,
               role: userData.role
          };
          return apiResponse.successResponseWithData(res, "OTP verified and login successfully", userJson);
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.profileUpdate = [
     SellerAuh,
     async (req, res) => {
     try{
          const { name, phone, email, description, location} = req.body;

          let userData = await Models.User.findOne({
               where: { id: req.user.id},
          });
          
          let update = {};
          if (name) update.name = name;
          if (phone) {
               phone = await sanitizedPhoneNumber(phone);
               if (!phone) {
                    console.log("Invalid phone number", phone);
                    return apiResponse.ErrorResponse(res, "Invalid phone number")
               }
               update.phone = phone
          };
          if (email) update.email = email;
          if (description) update.description = description;

          if (location){
               const {shop, address, city, tehsil, district} = req.body.location;
               if (!address) return apiResponse.validationErrorWithData(res, "Please provide address");
               if (!city) return apiResponse.validationErrorWithData(res, "Please provide city");
               if (!tehsil) return apiResponse.validationErrorWithData(res, "Please provide tehsil");
               if (!district) return apiResponse.validationErrorWithData(res, "Please provide district");
              
               await Models.Address.create({
                    userId: req.user.id,
                    shop,
                    address,
                    city,
                    tehsil,
                    district
               });
          }

          if(Object.keys(update).length < 1) return apiResponse.ErrorResponse(res, "Atleast one field is required to update profile");
          
          await Models.User.update({
               updatedAt: new Date(),
               ...update
          },
          {
               where: { id: userData.id },
          });

          userData = await Models.User.findOne({
               where: { id: req.user.id},
               include: {
                    model: Models.Address,
                    as: "address"
               },
               attributes: { exclude: ['otp','otpTries','otpExpiry'] }
          });

          return apiResponse.successResponseWithData(res, "Profile updated successfully", userData);
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.profile = [
     SellerAuh,
     async (req, res) => {
     try{
          let userData = await Models.User.findOne({
               where: { id: req.user.id},
               include: {
                    model: Models.Address,
                    as: "address"
               },
               attributes: { exclude: ['otp','otpTries','otpExpiry'] }
          });
          return apiResponse.successResponseWithData(res, "Profile fetched successfully", userData);
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.updateAddress = [
     SellerAuh,
     async (req, res) => {
     try{
          const { id, shop, address, district, tehsil, city } = req.body;
          if (!address) return apiResponse.validationErrorWithData(res, "Please provide address");
          if (!city) return apiResponse.validationErrorWithData(res, "Please provide city");
          if (!tehsil) return apiResponse.validationErrorWithData(res, "Please provide tehsil");
          if (!district) return apiResponse.validationErrorWithData(res, "Please provide district");

          if(id){
               let data = await Models.Address.findOne({
                    where: { id: id},
               });
               if (!data) return apiResponse.validationErrorWithData(res, "Address not found");
              
               data = await Models.Address.update({
                    shop,
                    address,
                    city,
                    tehsil,
                    district
               },
               {
                    where: { id: id },
               });
               return apiResponse.successResponseWithData(res, "Address updated successfully", data);
          }
          else{
               let data = await Models.Address.create({
                    userId: req.user.id,
                    shop,
                    address,
                    city,
                    tehsil,
                    district
               });
               return apiResponse.successResponseWithData(res, "Address added successfully", data);
          }
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
     }
]

exports.deleteAddress = [
     SellerAuh,
     async function(req, res) {
          try{
               let { id } = req.body;
               if (!id) return apiResponse.validationErrorWithData(res, "Please provide id");
               id = parseInt(id);
               let data = await Models.Address.findOne({
                    where: { id: id},
               });
               if (!data) return apiResponse.validationErrorWithData(res, "Address not found");
               await Models.Address.destroy({
                    where: { id: id },
               });
               return apiResponse.successResponse(res, "Address deleted successfully");
          }
          catch(err){
               console.log(err);
               return apiResponse.ErrorResponse(res, "Something went wrong");
          }
     }
]

exports.address = [
     SellerAuh,
     async function(req, res) {
          try{
               let data = await Models.Address.findAll({
                    where: { userId: req.user.id},
               });
               return apiResponse.successResponseWithData(res, "Address fetched successfully", data);
          }
          catch(err){
               console.log(err);
               return apiResponse.ErrorResponse(res, "Something went wrong");
          }
     }
]

exports.allUser = [
     async (req, res) => {
     try{
          let userData = await Models.User.findAll({
               where: {isSeller:true},
               attributes: { exclude: ['otp','otpTries','otpExpiry'] }
          });
          return apiResponse.successResponseWithData(res, "Users fetched successfully", userData);
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.changeAvatar = [
     SellerAuh,
     function (req, res) {
          try {
               upload(req, res, async (err) => {
                    if (err) {
                         return apiResponse.ErrorResponse(res, err.message);
                    }
     
                    if (!req.file) {
                         return apiResponse.ErrorResponse(res, "Image format not supported");
                    } else {
                         let result = await uploadFromBuffer(req.file.buffer);
                         let image = `/${result.public_id}.${result.format}`;

                         await Models.User.update({
                              avatar: image
                         },
                         {
                              where: { id: req.user.id },
                         });
                         return apiResponse.successResponseWithData(res,"Avatar Updated Sucessfully",  "http://res.cloudinary.com/dgemhvveu/image/upload"+image)
                 }
             });
 
         } catch (err) {
             //throw error in json response with status 500.
             return apiResponse.ErrorResponse(res, err.message);
         }
     }
 ];