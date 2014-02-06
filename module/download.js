"use strict";

var fs = require("fs");
var containers = "./containers/";

module.exports = function(common) {
    var app = common.app;
    
	/**
	 * POST - /download/:container/:file - download a file from the container
	 * params - key - the api key
	 */
	app.post("/download/:container/:file", function(req, res) {
		var key = req.body.key;
		var container = req.params.container;
		var file = req.params.file;
		if ((key !== undefined && key.length) && (container !== undefined && container.length)) {
			var path = getFile(container, key, file);
			if (!path.message) {
				res.download(path, file);
			} else {
				res.json(path);
			}
		} else {
			res.json({ error: "container and/or key not supplied "});
		}
	});
};

function getFile(container, key, file) {
	var path = containers + key + "/" + container +"/"+ file;
	var exists = fs.existsSync(path);
	if (exists) {
		return path;
	} else {
		return {error: "file not found"};
	}
}
