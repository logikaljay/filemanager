var uuid = require('node-uuid'),
	fs = require('fs'),
	mime = require('mime'),
	async = require('async'),
	error = { container: "error" },
	success = { container: "success" };

var containers = './containers/';

module.exports=function(app) {
		/**
		 * POST - /container/list/ - Get the containers
		 * param - key - the api key for the user
		 */
		app.post('/container/list', function(req, res) {
			var key = req.body.key;
			if (key != undefined && key.length) {
				success = { list: "success" };
				success.containers = getContainers(key);
				res.json(success);
			} else {
				error.message = "invalid key";
				res.json(error);
			}
		});
		
		/**
		 * POST - /container/:container/list - List files in a container
		 * param - container - The name of the container
		 * param - key - the api key for the user
		*/
		app.post('/container/:container/list', function(req, res) {
			var key = req.body.key;
			if (key != undefined && key.length) {
				success.container = req.params.container;
				success.files = [];
				var items = getContainerFiles(success.container, key);
				async.eachSeries(items, function(item, callback) {
					var output = getContainerFileStats(success.container, key, item);
					success.files.push(output);
					callback();
				}, function(err) {
					res.json(success);
				});
			} else {
				error.message = "invalid key";
				res.json(error);
			}
		});

		/**
		 * POST - /container/create - Create a container
		 * param - container - The name of the container
		 * param - key - the api key for the user
		 */
        app.post('/container/create', function(req, res) {
				var container = req.body.container;
				var key = req.body.key;
				if ((container != undefined && container.length) && (key != undefined && key.length)) {
    	            var result = createContainer(container, key);
					res.json(result);
				} else {
					error.message = "no container and/or key provided";
					res.json(error);
				}
        });
}

function getContainers(key) {
	var exists = fs.existsSync(containers + key);
	if (exists) {
		var items = fs.readdirSync(containers + key);
		return items;
	} else {
		error.message = "incorrect key";
		return error;
	}
}

function getContainerFiles(container, key) {
	var containerExists = fs.existsSync(containers + key + "/" + container);
	if (containerExists) {
		var output = [];
		var items = fs.readdirSync(containers + key + "/" + container);
		return items;
	} else {
		error.message = "incorrect container and/or key";
		return error;
	}
}

function getContainerFileStats(container, key, file) {
	var path = containers + key + "/" + container + "/" + file;
	var fileExists = fs.existsSync(path);
	if (fileExists) {
		var stats = fs.statSync(path);
		var type = mime.lookup(path);
		return { item: file, size: stats.size, mtime: stats.mtime, type: type };
	} else {
		error.message = "file(s) doesn't exist";
		return error;
	}
}

function createContainer(name, key) {
	var keyExists = fs.existsSync(containers + key);
	if (!keyExists) {
		var createKey = fs.mkdirSync(containers + key);
		if (createKey) {
			console.log(createKey);
			error.code = errKey.code;
			error.message = "cannot create a container";
			return error;
		} else {
			var createName = fs.mkdirSync(containers + key + "/" + name);
			if (createName) {
				console.log(createName);
				error.code = errName.code;
				error.message = "cannot create a container";
				return error;
			} else {
				success = { create: "success" };
				success.name = name;
				success.key = key;
				return success;
			}
		}
	} else {
		var exists = fs.existsSync(containers + key + "/" + name);
		if (exists) {
			error.message = "container already exists";
			return error;
		} else {
			var createName = fs.mkdirSync(containers + key + "/" + name);
			if (createName) {
				success.name = name;
				success.key = key;
				console.log(createName);
				return success;
			}
		}
	}
}
