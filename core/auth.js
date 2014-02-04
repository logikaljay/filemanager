var uuid = require('node-uuid'),
    crypto = require('crypto');

module.exports = function(common) {
    var app = common.app,
        mongoose = common.mongoose;
    
    /**
     * Attempt to log the user in, send a cookie if successful
     */
    app.post('/auth/login', function(req, res) {
         var post = req.body;
         
         // TODO: modify this to check the user against a database of users
         if (post.username == "jay" && post.password == "supersecret") {
             req.session.userId = 1234;
             // req.session.containers = hash of userId + | + password
             res.json({auth:"authenticated"});
         } else {
             var error = {};
             error.code = -1;
             error.message = "invalid username/password";
             res.json(error);
         }
    });
    
    /**
     * log user out
     */
    app.get('/auth/logout', function(req, res) {
        delete req.session.userId;
        res.redirect('/login');
    });
    
    /**
     * create account
     */
    app.post('/auth/create', function(req, res) {
        var post = req.body;
        if (post.email !== undefined && post.password !== undefined) {
            common.user.createUser(crypto, post.email, post.password, function(err, user) {
                if (user !== null) {
                    res.json(user);
                } else {
                    res.json(err);
                }
            });
        } else {
            res.json({ error: "invalid parameters supplied" });
        }
    });
    
    /**
     * reset api key for user
     */
    app.post('/auth/reset', function(req, res) {
        var post = req.body;
        if (post.email !== undefined && post.password !== undefined) {
            common.user.resetApi(crypto, post.email, post.password, function(err, result) {
               if (result !== null) {
                   res.json(result);
               } else {
                   res.json(err);
               }
            });
        } else {
            res.json({error: "invalid parameters supplied"});
        }
    });
    
    /**
     * catch all requests, make sure that they are authenticated before continuing
     
    app.all('*', function(req, res, next) {
       if (/^\/auth/g.test(req.url)) {
           return next();
       } else if (isAuthenticated(req)) {
           return next();
       } else {
           // TODO: find a better way to show the user that they need to authenticate before they can use this AP
           return next(new Error(401));
       }
    });
    */
    
    /**
     * Modify this function to test if the user is authenticated
     */
    function isAuthenticated(req) {
        if (req.session !== null) {
            console.log(req.session);
            if (req.session.userId !== undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};