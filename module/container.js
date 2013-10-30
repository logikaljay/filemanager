var uuid = require('node-uuid'),
	fs = require('fs'),
	error = { create: "error" },
	success = { create: "success" };

var containers = './containers/';

module.exports=function(app) {
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
