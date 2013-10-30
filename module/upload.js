var uuid = require('node-uuid'),
        fs = require('fs'),
        error = { upload: "error" },
        success = { upload: "success" };

module.exports=function(app) {
	app.get('/upload', function(req, res) {
		res.send('/upload called');
	});

	app.post('/upload', function(req, res) {
		var file = res.body.file;
		if (file != undefined && file.length) {
			// file exists
		} else {
			// file doesn't exist
		}
	});
}
