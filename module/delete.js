var uuid = require('node-uuid'),
	fs = require('fs'),
	fsExtra = require('fs.extra'),
	error = { delete: "error" },
	success = { delete: "success" };

var containers = './containers/';
	
module.exports = function(common) {
    var app = common.app;
    
	/**
	 * DELETE - /delete/:container/:file - delete a file from a container
	 * param - key - the api key
	 * param - container - the storage container
	 * param - file - the file to delete
	 */
	app.delete('/delete/:container/:file', function(req, res) {
		var key = req.body.key,
			container = req.params.container,
			file = req.params.file;
			
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
	var filePath = containers + key + "/" + name + "/" + file,
		fileExists = fs.existsSync(filePath);
		
	if (!fileExists) {
		error.message = "could not find file";
		return error;
	} else {
		var path = containers + key + "/" + name;
		
		// remove the file (probably a nicer way to do this)
		fsExtra.rmrfSync(path);
		
		// return some information regarding what we did
		success.container = name;
		success.file = file;
		success.message = "file deleted successfully";
		return success;
	}
}

