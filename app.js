var modules = './module/';

var express = require('express'),
	fs = require('fs'),
	app = express();

app.use(express.bodyParser());

var error = { status: 'error' },
	result = { status: 'success' };

fs.readdirSync(modules).forEach(function(file) {
	var module = modules + file;
	require(module)(app);
});

app.listen(process.env.PORT || 9123);
