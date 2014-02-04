module.exports = function(common) {
    common.user = {};
    
    var Schema = common.mongoose.Schema;
    
    var userSchema = new Schema({
        email: { type: String, index: { unique: true, dropDups: true} },
        salt: String,
        password: String,
        key: String,
        containers: []
    });
    
    common.schemas.user = userSchema;
    common.schemas.user.statics.findByApi = function(api, cb) {
        this.findOne({ key: api }, cb);
    };
    common.schemas.user.methods.emailExists = function(cb) {
        return this.model('User').find({ 'email': this.email }, cb);
    };
    
    
    common.user.resetApi = function(crypto, email, pass, cb) {
        var User = common.mongoose.model('User', userSchema);
        User.findOne({ 'email': email }, function (err, user) {
            if (err || user === null) {
                cb({ error: "could not find requested user" }, null);
            }
            
            var passwordAttempt = user.salt + "|" + pass;
            var passwordAttemptHash = crypto.createHash('sha256').update(passwordAttempt).digest('hex');
            if (user.password === passwordAttemptHash) {
                var api = crypto.randomBytes(20).toString('hex');
                user.key = api;
                
                user.save(function(err) {
                    if (err) {
                        cb({ error: "could not update the api key" });
                    }
                    
                    cb(null, { key: api });
                });
            } else {
                cb({ error: "incorrect username/password" }, null);
            }
        });
    };
    
    common.user.createUser = function(crypto, email, pass, cb) {
        var salt = crypto.randomBytes(10).toString('hex');
        var password = salt + "|" + pass;
        var passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        var api = crypto.randomBytes(20).toString('hex');
        
        var User = common.mongoose.model('User', userSchema);
        var newUser = new User({
           email: email,
           password: passwordHash,
           salt: salt,
           key: api
        });
        
        newUser.emailExists(function(err, users) {
            if (users.length === 0) {
                newUser.save(function(err) {
                    if (err) {
                        return null;
                    } 
                    
                    User.findById(newUser, function(err, doc) {
                        
                        cb(err, {
                            success: "User created",
                            email: doc.email,
                            key: doc.key
                        });
                    });
                });
            } else {
                cb({ error: "user existed" }, null);
            }
        });
    };
};