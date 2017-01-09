module.exports = function(app) {
    app.get('/s3test', function (req,res){
        res.redirect('/s3upload.html');
    });


    app.get('/getPresignedURL', function (req,res){
        console.log("getPresignedURL")
        var fileName = req.query.fileName;

        console.log(fileName)

        var AWS = require('aws-sdk');
        var s3 = new AWS.S3();
        console.log('Start getting presigned URL: ', fileName);
        const util = require('util')
     
        AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY})

        // Tried with and without this. Since s3 is not region-specific, I don't
        // think it should be necessary.
        // AWS.config.update({region: 'us-west-2'})

        const myBucket = 'amipaces'
        //file name from post request
        const myKey = fileName
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
      


         
         



    

