var uuid = require('node-uuid'),
	fs = require('fs'),
	fsExtra = require('fs.extra'),
	error = { rename: "error" },
	success = { rename: "success" };

var containers = './containers/';

module.exports=function(app) {
	app.put('/rename', function(req, res) {
		var key = req.body.key;
		var container = req.body.container;
		var oldName = req.body.oldname;
		var newName = req.body.newname;

		if ((key != undefined && key.length) && (container != undefined && container.length)) {
			if (oldName != undefined && newName != undefined) {
				var result = moveFile(container, key, oldName, newName);
				res.json(result);
			} else {
				error.message = "incorrect newfile and/or oldfile";
				res.json(error);
			}
		} else {
			error.message = "incorrect container and/or key";
			res.json(error);
		}
	});
}

function moveFile(container, key, oldName, newName) {
	var oldPath = containers + key + "/" + container + "/" + oldName,
		newPath = containers + key + "/" + container + "/" + newName;

	var oldNameExists = fs.existsSync(oldPath);
	if (oldNameExists) {
		var newPathExists = fs.existsSync(newPath);
		if (!newPathExists) {
			fs.renameSync(oldPath, newPath);
			success.oldname = oldName;
			success.newname = newName;
			success.message = "renamed file";
			return success;
		} else {
			error.message = "a file already exists with that name";
			return error;
		}
	} else {
		error.message = "cannot find file to rename";
		return error;
	}
}
