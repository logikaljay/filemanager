module.exports = function(common) {
    var Schema = common.mongoose.Schema;
    
    common.container = {};
    var containerSchema = new Schema({
        user: Schema.Types.ObjectId,
        name: String,
        storageLimit: Number,
        files: []
    });
    
    common.schemas.container = containerSchema;
    common.schemas.container.statics.checkExists = function(userId, containerName, cb) {
        this.findOne({ user: userId, name: containerName }, cb);
    };
    
    /**
     * Attempt to create a container
     */
    common.container.createContainer = function(containerName, userId, cb) {
        // Check if the container doesn't already exist for this user
        var Container = common.mongoose.model('Container', common.schemas.container);
        Container.checkExists(userId, containerName, function(err, container) {
            if (container) {
                cb({ error: "container already exists" });
            } else {
                var Container = common.mongoose.model('Container', common.schemas.container);
                var newContainer = new Container({
                    user: userId,
                    name: containerName,
                    storageLimit: 0,
                    files: []
                });
                
                newContainer.save(function(err) {
                    Container.findById(newContainer, function(err, container) {
                        cb({container: "created"});
                    }); 
                });
            }
        });
    };
};