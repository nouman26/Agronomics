var express = require("express");
var path = require("path");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./connection/db");

// DB connection
connectDB();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
	windowMs:  1*60*1000, // 1 minute
	max: 10000, // maximum 1000 requests per windowMs
	message: "Too many requests from this IP, please try again later."
 });

//To allow cross-origin requests
app.use(cors());
app.use(limiter)

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	// return apiResponse.notFoundResponse(res, "Page not found");
});

// app.use((err, req, res) => {
// 	if(err.name == "UnauthorizedError"){
// 		return apiResponse.unauthorizedResponse(res, err.message);
// 	}
// });

// module.exports = app;
app.listen(process.env.PORT || 4000, () => {});