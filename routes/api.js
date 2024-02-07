var express = require("express");

var app = express();

app.use("/auth/", require("./auth"));
app.use("/product/", require("./product"))

module.exports = app;
