"use strict";

module.exports=function(common) {
    var app = common.app;
    
	app.get("/resize", function(req, res) {
		res.send("/resize called");
	});
};
