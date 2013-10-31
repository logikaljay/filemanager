var uuid = require('node-uuid'),
	fs = require('fs'),
	fsExtra = require('fs.extra'),
	error = { delete: "error" },
	success = { delete: "success" };

var containers = './containers/';
	
module.exports=function(app) {
	app.delete('/delete/:container/:file', function(req, res) {
		var key = req.body.key;
		var container = req.params.container;
		var file = req.params.file;
		if (key != undefined && key.length) {
			var result = deleteFile(container, key, file);
			res.json(result);
		} else {
			error.message = "no api key provided";
			res.send(error);
		}
	});
}

function deleteFile(name, key, file) {
	var filePath = containers + key + "/" + name + "/" + file;
	var fileExists = fs.existsSync(filePath);
	if (!fileExists) {
		error.message = "could not find file";
	} else {
		var path = containers + key + "/" + name;
		fsExtra.rmrfSync(path);
		success.container = name;
		success.file = file;
		success.message = "file deleted successfully";
		return success;
	}
}

