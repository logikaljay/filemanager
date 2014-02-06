"use strict";

var schemas = "./schema/",
    core    = "./core/",
    modules = "./module/";

var express = require("express"),
	fs = require("fs"),
	mongoose = require("mongoose");
	
mongoose.connect("mongodb://localhost/filemanager");

var common = {
    app: express(),
    mongoose: require("mongoose")
};

var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
};

common.app.configure(function() {
	common.app.use(allowCrossDomain);
	common.app.use(express.bodyParser());
	common.app.use(express.cookieParser());
	common.app.use(express.session({secret: "QWERTY123456789"}));
});

common.schemas = {};
fs.readdirSync(schemas).forEach(function(file) {
    var schema = schemas + file;
    require(schema)(common);
});

common.core = {};
fs.readdirSync(core).forEach(function(file) {
    var module = core + file;
    require(module)(common);
});

common.modules = {};
fs.readdirSync(modules).forEach(function(file) {
	var module = modules + file;
	require(module)(common);
});

console.log("listening for connections on " + (process.env.PORT || 9123));
common.app.listen(process.env.PORT || 9123);
