module.exports = function(app) {
app.get('/s3test', function (req,res){
    res.redirect('/test.html');
});

}