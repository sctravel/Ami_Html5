module.exports = function(app) {

    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();

    app.get('/s3test', function (req,res){
        res.redirect('/test.html');
    });


    app.post('/getPresignedURL', function (req,res){
        console.log('Start getting presigned URL: '+req.files);
        const util = require('util')
     
        AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY})

        // Tried with and without this. Since s3 is not region-specific, I don't
        // think it should be necessary.
        // AWS.config.update({region: 'us-west-2'})

        const myBucket = 'amipaces'
        //file name from post request
        const myKey = ''
        const signedUrlExpireSeconds = 60 * 5

        const url = s3.getSignedUrl('getObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        })
        console.log(url)
        res.send(url)
    });
}

        // var file = req.files.file;
      


         
         



    

