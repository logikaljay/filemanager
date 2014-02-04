module.exports = function(common) {
    var Schema = common.mongoose.Schema;
    
    common.fileSchema = new Schema({
        name: String,
        size: Number,
        type: String,
        date: { type: Date, default: Date.now },
        description: String
    });
    
    common.fileSchema.statics.findSimilarNames = function(cb) {
        this.model('File').find({ name: 'test' }, cb);
    };
}