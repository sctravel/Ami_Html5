module.exports = function(app) {
    app.get('/s3test', function (req,res){
        res.redirect('/s3upload.html');
    });


    app.get('/getPresignedURL', function (req,res){
        console.log("getPresignedURL")
        var fileName = req.query.fileName;
        var type = req.query.type;

        console.log(fileName)

        var AWS = require('aws-sdk');

       // AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY})
        console.log('Start getting env ', process.env);
        console.log('Start getting AWS_ACCESS_KEY_ID: ', process.env.AWS_ACCESS_KEY_ID);
        console.log('Start getting AWS_SECRET_ACCESS_KEY: ', process.env.AWS_SECRET_ACCESS_KEY);

        var s3 = new AWS.S3();
        console.log('Start getting presigned URL: ', fileName);
        const util = require('util')
        // Tried with and without this. Since s3 is not region-specific, I don't
        // think it should be necessary.
        AWS.config.update({region: 'us-west-2'})

        const myBucket = 'amipaces' //switch to new subscription
        console.log('Start getting myBucket name for  presigned URL: ', myBucket);
        //file name from post request
        const myKey = fileName
        //const myKey = "items.csv" //fileName, here for debugging
        //type = 'text/csv'
        const signedUrlExpireSeconds = 60 * 100

        const url = s3.getSignedUrl('putObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds,
            ContentType:type//'text/csv'
        })
        console.log("curl -v --upload-file -H \"Content-Type:text/csv\" items.csv \""+url+"\"")
        res.send(url)
    });
}
      


         
         



    

