"use strict";

var fs = require("fs"),
	mime = require("mime"),
	async = require("async"),
	error = { container: "error" },
	success = { container: "success" };

module.exports = function(common) {
	var containers = common.path.containers;

    var app = common.app;
    
	/**
	 * POST - /container/list/ - Get the containers
	 * @param {string} key The api key for the user
	 */
	app.get("/container/list", function(req, res) {
		var key = req.query.key;
		if (key !== undefined && key.length) {
			success = { container: "success" };
			success.containers = [];
			var User = common.mongoose.model("User", common.schemas.user);
			if (User === null) {
				res.json({error: "could not list containers"});
			} else {
				var Container = common.mongoose.model("Container", common.schemas.container);
				Container.find().populate({
				        path: "_creator",
				        match: { key: key }
				    }).exec(function(err, containers) {
				        console.log(containers);
				    async.eachSeries(containers, function(item, callback) {
				        if (item._creator !== null) {
	                        success.containers.push({
	                            name: item.name
	                        });
				        }
				        
	                    callback();
	                }, function(err) {
						if (err) {
							res.json({error: "could not list containers"});
						} else {
							res.json(success);
						}
	                });
				});
			}
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
	app.get("/container/:container/list", function(req, res) {
		var key = req.query.key;
		if (key !== undefined && key.length) {
			success.container = req.params.container;
			success.files = [];
			var User = common.mongoose.model("User", common.schemas.user);
			User.findByApi(key, function(err, user) {
			    if (user === null) {
			        res.json({error: "invalid api key"});
			    } else {
					var File = common.mongoose.model("File", common.schemas.file);
					var Container = common.mongoose.model("Container", common.schemas.container);
					Container.findByApiAndName(key, req.params.container, function(err, container) {
						if (container.length < 1) {
							res.json({error: "couldn't find container"});
						}
						File.find().populate({
							path: "_creator",
							match: { name: req.params.container }
						}).exec(function(err, files) {
							async.eachSeries(files, function(file, callback) {
								if (file._creator !== null) {
									var fileName = file.name;
									var output = getContainerFileStats(req.params.container, user._id, fileName);
									success.files.push(output);
								}
								callback();
							}, function(err) {
								if (err) {
									res.json({error: "could not find container"});
								} else {
									res.json(success);
								}
							});
						});
					});
			    }
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
	app.get("/container/create/:container", function(req, res) {
		var container = req.params.container;
		var key = req.query.key;
		
        var User = common.mongoose.model("User", common.schemas.user);
        User.findByApi(key, function(err, user) {
            if (user) {
                createContainer(common.container, container, user._id, function(result) {
                    res.json(result);
                });
            } else {
                res.json({error: "failed to create container"});
            }
        });
	});

	function getContainerFileStats(container, userId, file) {
		var path = containers + userId + "/" + container + "/" + file;
		var fileExists = fs.existsSync(path);
		if (fileExists) {
			var stats = fs.statSync(path);
			var type = mime.lookup(path);
			return { item: file, size: stats.size, mtime: stats.mtime, type: type };
		} else {
			error.message = "file doesn't exist";
			return error;
		}
	}

	function createContainer(db, name, userId, cb) {
		var keyExists = fs.existsSync(containers + userId);
		if (!keyExists) {
			var createKey = fs.mkdirSync(containers + userId);
			if (createKey) {
				error.message = "cannot create a container";
	            cb(error);
			} else {
				var createName = fs.mkdirSync(containers + userId + "/" + name);
				if (createName) {
					error.message = "cannot create a container";
					cb(error);
				} else {
	                db.createContainer(name, userId, function(err, result) {
	                    cb(result);
	                });
				}
			}
		} else {
			var exists = fs.existsSync(containers + userId + "/" + name);
			if (exists) {
				error.message = "container already exists";
				cb(error);
			} else {
				fs.mkdirSync(containers + userId + "/" + name);
	            db.createContainer(name, userId, function(result) {
	                cb(result);
	            });
			}
		}
	}
};