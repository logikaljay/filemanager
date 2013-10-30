module.exports=function(app) {
	app.get('/upload', function(req, res) {
		res.send('/upload called');
	});
}
