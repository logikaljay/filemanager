var uuid = require('node-uuid'),
	fs = require('fs'),
	fsExtra = require('fs.extra'),
	mime = require('mime'),
	async = require('async'),
	error = { container: "error" },
	success = { container: "success" };

var containers = './containers/';

module.exports = function(common) {
    var app = common.app;
    
	/**
	 * POST - /container/list/ - Get the containers
	 * param - key - the api key for the user
	 */
	app.get('/container/list', function(req, res) {
		var key = req.query.key;
		if (key !== undefined && key.length) {
			success = { container: "success" };
			var containers = getContainers(key);
			success.containers = [];
			var User = common.mongoose.model('User', common.schemas.user);
			var Container = common.mongoose.model('Container', common.schemas.container);
			Container.find().populate({
			        path: '_creator',
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
                    res.json(success);
                });
			});
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
	app.get('/container/:container/list', function(req, res) {
		var key = req.query.key;
		if (key !== undefined && key.length) {
			success.container = req.params.container;
			success.files = [];
			var User = common.mongoose.model('User', common.schemas.user);
			User.findByApi(key, function(err, user) {
			    if (user === null) {
			        res.json({error: "invalid api key"});
			    } else {
    			    var File = common.mongoose.model('File', common.schemas.file);
        			var Container = common.mongoose.model('Container', common.schemas.container);
        			Container.findByApiAndName(key, req.params.container, function(err, container) {
        			    console.log(container);
        			    if (container.length < 1) {
        			        res.json({error: "couldn't find container"});
        			    }
            			File.find().populate({
            			    path: '_creator',
            			    match: { name: req.params.container }
            			}).exec(function(err, files, container) {
            			    async.eachSeries(files, function(file, callback) {
            			        if (file._creator !== null) {
            			            console.log(file);
            			            var fileName = file.name;
            			            var output = getContainerFileStats(req.params.container, user._id, fileName);
            			            success.files.push(output);
            			        }
            			        callback();
            			    }, function(err) {
            			        res.json(success);
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
	app.get('/container/create/:container', function(req, res) {
		var container = req.params.container;
		var key = req.query.key;
		
        var User = common.mongoose.model('User', common.schemas.user);
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
	
	/**
	 * DELETE - /container/delete - Create a container
	 * param - container - The name of the container
	 * param - key - the api key for the user
	*/
	app.delete('/container/delete/:container', function(req, res) {
		var container = req.params.container;
		console.log(req.body);
		var key = req.body.key;
		if ((container !== undefined && container.length) && (key !== undefined && key.length)) {
			var User = common.mongoose.model('User', common.schemas.user);
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

function getContainerFileStats(container, userId, file) {
	var path = containers + userId + "/" + container + "/" + file;
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

function createContainer(db, name, userId, cb) {
	var keyExists = fs.existsSync(containers + userId);
	if (!keyExists) {
		var createKey = fs.mkdirSync(containers + userId);
		if (createKey) {
			console.log(createKey);
			error.message = "cannot create a container";
            cb(error);
		} else {
			var createName = fs.mkdirSync(containers + userId + "/" + name);
			if (createName) {
				console.log(createName);
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
