var modules = './module/';

var express = require('express'),
	fs = require('fs'),
	app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.configure(function() {
	app.use(allowCrossDomain);
	app.use(express.bodyParser());
});

var error = { status: 'error' },
	result = { status: 'success' };

fs.readdirSync(modules).forEach(function(file) {
	var module = modules + file;
	require(module)(app);
});

app.listen(process.env.PORT || 9123);
