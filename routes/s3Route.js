module.exports = function(app) {

    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();

    app.get('/s3test', function (req,res){
        res.redirect('/test.html');
    });


    app.post('/upload', function (req,res){
        console.log('Start uploading the file'+req.files);

        const util = require('util')
     

        req.form.complete(function (err, fields, files) {
            // here lies your uploaded file:
            var path = files['fileField']
               console.log(util.inspect(files, {showHidden: false, depth: null}))
            // do knox stuff here
        });
    });
}

        // var file = req.files.file;
      


         
         



    

