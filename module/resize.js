module.exports=function(app) {
	app.get('/resize', function(req, res) {
 		res.send("/resize called");
	});
}
