module.exports = function(app) {

/* GET users listing. */
app.get('/tests', function(req, res, next) {
     console.log("########start retrieving tests");

     results = "Hello world"

     res.send(results);
});

}