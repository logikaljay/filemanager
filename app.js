"use strict";

var express = require("express"),
	fs = require("fs"),
	mongoose = require("mongoose");
	
mongoose.connect("mongodb://localhost/filemanager");

var common = {
    app: express(),
    mongoose: require("mongoose"),
    path: {
        containers: "./containers/",
        schemas: "./schema/",
        core: "./core/",
        modules: "./module/"
    }
};

// setup express
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

// Load any schemas
common.schemas = {};
fs.readdirSync(common.path.schemas).forEach(function(file) {
    var schema = common.path.schemas + file;
    require(schema)(common);
});

// Load core modules
common.core = {};
fs.readdirSync(common.path.core).forEach(function(file) {
    var module = common.path.core + file;
    require(module)(common);
});

// Load non-essential modules
common.modules = {};
fs.readdirSync(common.path.modules).forEach(function(file) {
	var module = common.path.modules + file;
	require(module)(common);
});

// start express
common.app.listen(process.env.PORT || 9123);
