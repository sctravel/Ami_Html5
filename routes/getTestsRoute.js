module.exports = function(app) {

/* GET users listing. */
app.get('/tests', function(req, res, next) {
     console.log("########start retrieving tests");

     jsonObject = { b: 1 }

     res.setHeader('Content-Type', 'application/json');
     res.send(JSON.stringify(jsonObject));

});

}