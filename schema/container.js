module.exports = function(common) {
    var Schema = common.mongoose.Schema;
    
    var containerSchema = new Schema({
        user: Schema.Types.ObjectId,
        name: String,
        storageLimit: Number,
        files: []
    });
}