const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");
const validatePhone = require("../helpers/validatePhone");
const randomNumber = require("../helpers/randomNumber");
const moment = require("moment");
const sendEmail = require("../helpers/sendEmail");
const sendMessage = require("../helpers/sendMessage");
const jwt = require("jsonwebtoken");
const multer = require("multer");
let auth = require("../middlewares/jwt");

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, "./public/avatars");
     },
     filename: (req, file, cb) => {
         console.log(file);
         cb(null, Date.now() + file.originalname);
     }
 });
 
 
 const fileFilter = (req, file, cb) => {
     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/heif" || file.mimetype == "image/heic") {
         cb(null, true);
     } else {
         cb(null, false);
     }
 };
 
 const upload = multer({storage: storage, fileFilter: fileFilter}).single("avatar");

exports.passwordLessLogin = [
     async (req, res) => {
     try{
          const { email, phone, type} = req.body;
          if (!email && !phone)
          return apiResponse.validationErrorWithData(res, "Please provide email or phone");
     
          let userData = {};
          const otpExpiry = moment().add(10, "minutes").valueOf();
          let otp = await randomNumber(4);
          if (email) {
               userData = await Models.User.findOne({
                    where: { email: email, type: type},
               });
          }
          else if (phone) {
               let validatePhoneError = validatePhone(phone);
               console.log(validatePhoneError);
               if (validatePhoneError) return apiResponse.validationErrorWithData(res, validatePhoneError);
               userData = await Models.User.findOne({
                    where: { phone: phone },
               });
          }
          
          if (!userData) {
               userData = await Models.User.create({
                    email: email,
                    phone: phone,
                    type: type,
                    otp: otp,
                    otpExpiry: otpExpiry
               });
          }
          else {
               await Models.User.update({
                    otp: otp,
                    otpExpiry: otpExpiry,
                    otpTries: 0
               },
               {
                    where: { id: userData.id },
               });
          }
          
          // send otp to email or phone
          if (email) {
               // send otp to email
               let replacements = {
                    otp: otp,
               };
               await sendEmail("otp", replacements, email, "OTP");
               return apiResponse.successResponseWithData(res, "OTP sent successfully to your email",{
                    id: userData.id,
                    email: userData.email,
               });
          }
          else if (phone) {
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
          console.log(parseInt(id))
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
               firstName: userData.firstName,
               lastName: userData.lastName,
               email: userData.email,
               phone: userData.phone,
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
               firstName: userData.firstName,
               lastName: userData.lastName,
               email: userData.email,
               phone: userData.phone,
               token: userData.token
          };
          return apiResponse.successResponseWithData(res, "OTP verified and login successfully", userJson);
     }
     catch(err){
          console.log(err);
          return apiResponse.ErrorResponse(res, "Something went wrong");
     }
}];

exports.profileUpdate = [
     auth,
     async (req, res) => {
     try{
          const { firstName, lastName, location, phone, email } = req.body;
          if (!firstName) return apiResponse.validationErrorWithData(res, "Please provide first name");
          if (!lastName) return apiResponse.validationErrorWithData(res, "Please provide last name");
          if (!location) return apiResponse.validationErrorWithData(res, "Please provide address");
          
          let userData = await Models.User.findOne({
               where: { id: req.user.id},
          });
          
          let update = {};
          if (firstName) update.firstName = firstName;
          if (lastName) update.lastName = lastName;
          if (phone) update.phone = phone;
          if (email) update.email = email;

          if (location){
               const {address, city, province, pincode, country, latitude, longitude } = req.body.location;
               if (!address) return apiResponse.validationErrorWithData(res, "Please provide address");
               if (!city) return apiResponse.validationErrorWithData(res, "Please provide city");
               if (!province) return apiResponse.validationErrorWithData(res, "Please provide province");
               if (!pincode) return apiResponse.validationErrorWithData(res, "Please provide pincode");
               if (!country) return apiResponse.validationErrorWithData(res, "Please provide country");
               if (!latitude) return apiResponse.validationErrorWithData(res, "Please provide latitude");
               if (!longitude) return apiResponse.validationErrorWithData(res, "Please provide longitude");
              
               await Models.Address.create({
                    userId: req.user.id,
                    address,
                    city,
                    province,
                    pincode,
                    country,
                    latitude,
                    longitude
               });
          }

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
     auth,
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
     auth,
     async (req, res) => {
     try{
          const { id, address, city, province, pincode, country, latitude, longitude } = req.body;
          if (!address) return apiResponse.validationErrorWithData(res, "Please provide address");
          if (!city) return apiResponse.validationErrorWithData(res, "Please provide city");
          if (!province) return apiResponse.validationErrorWithData(res, "Please provide province");
          if (!pincode) return apiResponse.validationErrorWithData(res, "Please provide pincode");
          if (!country) return apiResponse.validationErrorWithData(res, "Please provide country");
          if (!latitude) return apiResponse.validationErrorWithData(res, "Please provide latitude");
          if (!longitude) return apiResponse.validationErrorWithData(res, "Please provide longitude");

          if(id){
               let data = await Models.Address.findOne({
                    where: { id: id},
               });
               if (!data) return apiResponse.validationErrorWithData(res, "Address not found");
              
               data = await Models.Address.update({
                    address: address,
                    city: city,
                    province: province,
                    pincode: pincode,
                    country: country,
                    latitude: latitude,
                    longitude: longitude
               },
               {
                    where: { id: id },
               });
               return apiResponse.successResponseWithData(res, "Address updated successfully", data);
          }
          else{
               let data = await Models.Address.create({
                    userId: req.user.id,
                    address: address,
                    city: city,
                    province: province,
                    pincode: pincode,
                    country: country,
                    latitude: latitude,
                    longitude: longitude
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
     auth,
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
     auth,
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
               where: {},
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
     auth,
     function (req, res) {
          try {
               upload(req, res, async (err) => {
                    if (err) {
                         return apiResponse.ErrorResponse(res, err.message);
                    }
     
                    if (!req.file) {
                         return apiResponse.ErrorResponse(res, "Image format not supported");
                    } else {
                         await Models.User.update({
                              avatar: "/avatar/"+req.file.filename
                         },
                         {
                              where: { id: req.user.id },
                         });
                         return apiResponse.successResponseWithData(res,"Avatar Updated Sucessfully",  "/avatar/"+req.file.filename)
                 }
             });
 
         } catch (err) {
             //throw error in json response with status 500.
             return apiResponse.ErrorResponse(res, err.message);
         }
     }
 ];