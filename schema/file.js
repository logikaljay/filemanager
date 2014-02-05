module.exports = function(common) {
    common.file = {};
    
    var Schema = common.mongoose.Schema;
    
    common.schemas.file = new Schema({
        name: String,
        size: Number,
        type: String,
        date: { type: Date, default: Date.now },
        description: String,
        _creator: { type: Schema.Types.ObjectId, ref: 'Container' }
    });
    
    common.schemas.file.statics.findSimilarNames = function(cb) {
        this.model('File').find({ name: 'test' }, cb);
    };
    common.schemas.file.statics.createFileForApi = function(api, containerName, name, size, type, cb) {
        var User = common.mongoose.model('User', common.schemas.user);
        User.findByApi(api, function(err, user) {
            var Container = common.mongoose.model('Container', common.schemas.container);
            Container.findOne({ name: containerName, _creator: user }, function(err, container) {
                var File = common.mongoose.model('File', common.schemas.file);
                var uploaded = new File({
                    name: name,
                    size: size,
                    type: type,
                    date: new Date(),
                    _creator: container
                });
                
                uploaded.save(function(err) {
                    File.findById(uploaded, function(err, file) {
                       cb(err, file); 
                    });
                });
            });
        });
    };
    
    common.file.deleteFile = function(containerName, fileName, user, cb) {
        var User = common.mongoose.model('User', common.schemas.user);
        var File = common.mongoose.model('File', common.schemas.file);
        var Container = common.mongoose.model('Container', common.schemas.container);
        User.findById(user, function(err, user) {
            if (user === null) {
                cb({error:"invalid api key"});
            }
            Container.findOne({ name: containerName }, function(err, container) {
                if (container === null) {
                    cb({error:"couldn't find file"});
                } else {
                    File.findOne({ _creator: container, name: fileName }, function(err, file) {
                        if (file === null) {
                            cb({error:"couldn't find file"});
                        } else {
                            file.remove(function(err) {
                                cb({deleted: fileName});
                            });
                        }
                    });
                }
            });
        });
    };
};