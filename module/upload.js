var uuid = require('node-uuid'),
	fs = require('fs'),
	error = { upload: "error" },
	success = { upload: "success" };

var containers = './containers/';

module.exports = function(common) {
    var app = common.app;
    
	app.get('/upload', function(req, res) {
		res.send('/upload called');
	});

	app.post('/upload', function(req, res) {
		var key = req.body.key,
			container = req.body.container,
			file = req.files.file;

		if (file === undefined) {
			console.log(req.files);
			error.message = "no file supplied";
			res.json(error);
		}

		if (container === undefined || key === undefined) {
			error.message = "incorrect key and or container";
			res.json(error);
		}

		if (file !== undefined && file.size) {
			// file exists
			fs.readFile(file.path, function(err, data) {
				var newPath = containers + key + "/" + container;
				fs.writeFile(newPath +"/"+ file.name, data, function(err) {
					if (err) {
						console.log(err);
						error.message = "could not save the file";
						res.json(error);
					}

					success.message = "file uploaded";
					success.name = file.name;
					success.size = file.size;
					success.type = file.type;

					res.json(success);
				});
			});
		} else {
			error.message = "no file supplied";
			res.json(error);
		}
	});
}
