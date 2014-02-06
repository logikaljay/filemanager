"use strict";

var crypto = require("crypto");

module.exports = function(common) {
    var app = common.app;
    
    /**
     * create account
     */
    app.post("/auth/create", function(req, res) {
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
    app.post("/auth/reset", function(req, res) {
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
};