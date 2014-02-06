"use strict";

var	fs = require("fs"),
	fsExtra = require("fs.extra"),
	error = { delete: "error" },
	success = { delete: "success" };

var containers = "./containers/";
	
module.exports = function(common) {
    var app = common.app;
    
	/**
	 * DELETE - /delete/:container/:file - delete a file from a container
	 * param - key - the api key
	 * param - container - the storage container
	 * param - file - the file to delete
	 */
	app.delete("/delete/:container/:file", function(req, res) {
		var key = req.body.key,
			container = req.params.container,
			file = req.params.file;
			
		if (key !== undefined && key.length) {
		    var User = common.mongoose.model("User", common.schemas.user);
		    User.findByApi(key, function(err, user) {
		        if (user === null) {
		            res.send({error: "invalid api key"});
		        } else {
					deleteFile(common.file, container, user._id, file, function(result) {
						res.json(result);
					});
		        }
		    });
		} else {
			error.message = "invalid api key";
			res.send(error);
		}
	});
	
	/**
	 * DELETE - /delete/:continer - Create a container
	 * param - key - the api key for the user
	*/
	app.delete("/delete/:container", function(req, res) {
		var container = req.params.container;
		console.log(req.body);
		var key = req.body.key;
		if ((container !== undefined && container.length) && (key !== undefined && key.length)) {
			var User = common.mongoose.model("User", common.schemas.user);
			User.findByApi(key, function(err, user) {
				deleteContainer(common.container, container, user._id, function(result) {
                    res.json(result);
				});
			});
		} else {
			error.message = "no container and/or key provided";
			res.json(error);
		}
	});
};


function deleteFile(db, containerName, user, fileName, cb) {
	var filePath = containers + user + "/" + containerName + "/" + fileName,
		fileExists = fs.existsSync(filePath);
		
	console.log(filePath);
		
	if (!fileExists) {
		error.message = "couldn't find file";
		return error;
	} else {
		var path = containers + user + "/" + fileName;
		
		// remove the file (probably a nicer way to do this)
		fsExtra.rmrfSync(path);
		
		// return some information regarding what we did
		success.container = containerName;
		success.file = fileName;
		success.message = "file deleted successfully";
		
		db.deleteFile(containerName, fileName, user, function(result) {
		    cb(result);
		});
	}
}

function deleteContainer(db, name, userId, cb) {
	var keyExists = fs.existsSync(containers + userId);
	if (!keyExists) {
		error.message = "incorrect api key";
		cb(error);
	} else {
	    console.log(containers + userId + "/" + name);
		var containerExists = fs.existsSync(containers + userId + "/" + name);
		if (!containerExists) {
			error.message = "container does not exist";
			cb(error);
		} else {
			var path = containers + userId + "/" + name;
			fsExtra.rmrfSync(path);
			success.container = name;
			success.message = "container deleted successfully";
			
			db.deleteContainer(name, userId, function(result) {
			    cb(result);
			});
		}
	}
}
