module.exports = function(common) {
    var Schema = common.mongoose.Schema;
    
    common.container = {};
    var containerSchema = new Schema({
        name: String,
        storageLimit: Number,
        files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
        _creator: { type: Schema.Types.ObjectId, ref: 'User' }
    });
    
    common.schemas.container = containerSchema;
    common.schemas.container.statics.checkExists = function(user, containerName, cb) {
        this.findOne({ user: user, name: containerName }, cb);
    };
    common.schemas.container.statics.findByUser = function(user, cb) {
        this.find({ user: user }, cb);  
    };
    common.schemas.container.statics.findByApi = function(api, cb) {
        var _self = this;
        var User = common.mongoose.model('User', common.schemas.user);
        User.findByApi(api, function(err, user) {
            var userId = user._id;
            _self.find({ _creator: user }, cb);
        });
    };
    common.schemas.container.statics.findByApiAndName = function(api, name, cb) {
        var _self = this;
        var User = common.mongoose.model('User', common.schemas.user);
        User.findByApi(api, function(err, user) {
            _self.find({ _creator: user, name: name }, cb);
        });
    };
    
    /**
     * Attempt to create a container
     */
    common.container.createContainer = function(containerName, user, cb) {
        // TODO: Check if the container doesn't already exist for this user
        
        var User = common.mongoose.model('User', common.schemas.user);
        User.findById(user, function(err, user) {
            var Container = common.mongoose.model('Container', common.schemas.container);
            var newContainer = new Container({
                name: containerName,
                storageLimit: 0,
                files: [],
                _creator: user._id
            });
            
            newContainer.save(function(err) {
                cb({container: "created"}); 
            });
        }); 
    };
    
    common.container.deleteContainer = function(containerName, user, cb) {
        var User = common.mongoose.model('User', common.schemas.user);
        User.findById(user, function(err, user) {
            var Container = common.mongoose.model('Container', common.schemas.container);
            Container.findOne({ name: containerName, _creator: user._id }, function(err, container) {
                if (container === null) {
                    cb({container:"couldn't find container"});
                    
                } else {
                    container.remove(function(err) {
                        cb({container:"deleted"}); 
                    });
                }
            });
        });
    };
};