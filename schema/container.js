"use strict";

module.exports = function(common) {
    var Schema = common.mongoose.Schema;
    
    common.container = {};
    var containerSchema = new Schema({
        name: String,
        storageLimit: Number,
        files: [{ type: Schema.Types.ObjectId, ref: "File" }],
        _creator: { type: Schema.Types.ObjectId, ref: "User" }
    });
    
    common.schemas.container = containerSchema;
    /**
     * Check if container already exists
     * @param  {String}   user the user _id
     * @param  {String}   containerName the container name
     * @param  {Function} cb the callback
     */
    common.schemas.container.statics.checkExists = function(user, containerName, cb) {
        this.findOne({ user: user, name: containerName }, cb);
    };
    common.schemas.container.statics.findByUser = function(user, cb) {
        this.find({ user: user }, cb);
    };
    common.schemas.container.statics.findByApi = function(api, cb) {
        var _self = this;
        var User = common.mongoose.model("User", common.schemas.user);
        User.findByApi(api, function(err, user) {
            _self.find({ _creator: user }, cb);
        });
    };
    common.schemas.container.statics.findByApiAndName = function(api, name, cb) {
        var _self = this;
        var User = common.mongoose.model("User", common.schemas.user);
        User.findByApi(api, function(err, user) {
            _self.find({ _creator: user, name: name }, cb);
        });
    };
    
    /**
     * Create a container
     * @param  {String}   containerName The name of the container
     * @param  {String}   user The user _id
     * @param  {Function} cb the callback
     */
    common.container.createContainer = function(containerName, user, cb) {
        // TODO: Check if the container doesn't already exist for this user
        if (common.container.checkExists(containerName, user)) {
            cb({ error: "container already exists" });
        } else {
            var User = common.mongoose.model("User", common.schemas.user);
            User.findById(user, function(err, user) {
                var Container = common.mongoose.model("Container", common.schemas.container);
                var newContainer = new Container({
                    name: containerName,
                    storageLimit: 0,
                    files: [],
                    _creator: user._id
                });
                
                newContainer.save(function(err) {
                    if (err) {
                        cb(err);
                    } else {
                        cb({ container: "created" });
                    }
                });
            });
        }
    };
    
    /**
     * Delete a container
     * @param  {String}   containerName The container name
     * @param  {String}   user the user _id
     * @param  {Function} cb the callback
     */
    common.container.deleteContainer = function(containerName, user, cb) {
        var User = common.mongoose.model("User", common.schemas.user);
        User.findById(user, function(err, user) {
            var Container = common.mongoose.model("Container", common.schemas.container);
            Container.findOne({ name: containerName, _creator: user._id }, function(err, container) {
                if (container === null) {
                    cb({ container: "couldn't find container"  });
                } else {
                    var File = common.mongoose.model("File", common.schemas.file);
                    File.find({_creator: container}, function(err, files) {
                        files.forEach(function(file) {
                           file.remove(function(err) {
                                if (err) {
                                    cb(err);
                                }
                           });
                        });
                    });
                    
                    container.remove(function(err) {
                        if (err) {
                            cb(err);
                        } else {
                            cb({container:"deleted"});
                        }
                    });
                    
                }
            });
        });
    };

    /**
     * Check if a container exists
     * @param  {String} containerName the container name
     * @param  {String} user the user id
     * @returns {bool} true if container exists
     */
    common.container.checkExists = function(containerName, user) {
        var User = common.mongoose.model("User", common.schemas.user);
        User.findById(user, function(err, user) {
            if (err) {
                return false;
            } else {
                var Container = common.mongoose.model("Container", common.schemas.container);
                Container.findOne({ name: containerName, _creator: user._id }, function(err, container) {
                    if (err) {
                        return false;
                    } else {
                        if (container === null) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                });
            }
        });
    };
};