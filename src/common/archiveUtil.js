/**
 * Created by xitu on 1/3/2017.
 */
var archiver = require('archiver');
var logger = require('./logger');

exports.zipFolder = function(folderPath, zipPath, onEndFunction) {
    // create a file to stream archive data to.
    var output = fs.createWriteStream(zipPath);
    var archive = archiver('zip', {
        store: true // Sets the compression method to STORE.
    });

// listen for all archive data to be written
    output.on('close', function() {
        onEndFunction();
        logger.info(archive.pointer() + ' total bytes');
        logger.info('archiver has been finalized and the output file descriptor has closed.');
    });

// good practice to catch this error explicitly
    archive.on('error', function(err) {
        logger.error(err);
        throw err;
    });

// pipe archive data to the file
    archive.pipe(output);

// append files from a directory
    archive.directory(folderPath);

// finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize();
}