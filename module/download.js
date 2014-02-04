var uuid = require('node-uuid'),
        fs = require('fs'),
        mime = require('mime'),
        async = require('async'),
        error = { download: "error" },
        success = { download: "success" };

var containers = './containers/';

module.exports = function(common) {
    var app = common.app;
    
	/**
	 * POST - /download/:container/:file - download a file from the container
	 * params - key - the api key
	 */
	app.post('/download/:container/:file', function(req, res) {
		var key = req.body.key;
		var container = req.params.container;
		var file = req.params.file;
		if ((key != undefined && key.length) && (container != undefined && container.length)) {
			var path = getFile(container, key, file);
			if (!path.message) {
				res.download(path, file);
			} else {
				res.json(path);
			}
		} else {
			error.message = "container and/or key not supplied";
			res.json(error);
		}
	});
}

function getFile(container, key, file) {
	var path = containers + key + "/" + container +"/"+ file;
	var exists = fs.existsSync(path);
	if (exists) {
		var file = path;
		return file;
	} else {
		error.message = "file not found";
		return error;
	}
}
