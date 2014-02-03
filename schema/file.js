/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/filemanager');

//var Schema = mongoose.Schema;
    
var fileSchema = new mongoose.Schema({
    name: String,
    size: Number,
    type: String,
    date: { type: Date, default: Date.now },
    description: String
});

var File = mongoose.model('File', fileSchema);
var uploaded = new File({
   name: "test",
   size: 123456,
   type: "text/html",
   date: new Date(),
   description: "blah blah blah"
});

uploaded.save(function(err) {
    if (err) {
        console.log(err);
    }
});

File.find(function(err, result) {
    if (err) {
        console.log(err);
    } 
    
    console.log(result);
});

}*/

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