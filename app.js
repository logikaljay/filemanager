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
	app.use(express.cookieParser());
	app.use(express.session({secret: '123456789QWERTY'}));
});

var error = { status: 'error' },
	result = { status: 'success' };

fs.readdirSync(modules).forEach(function(file) {
	var module = modules + file;
	require(module)(app);
});

console.log("listening for connections on " + process.env.PORT);
app.listen(process.env.PORT);