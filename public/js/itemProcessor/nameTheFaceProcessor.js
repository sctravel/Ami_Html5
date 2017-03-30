/**
 * Created by xitu on 2/23/2017.
 */
function processNameTheFace(stream, item) {
    JL("client").info("Entering  processNameTheFace for " +item.type+"."+item.item );
    var audioList = item.audio.split(':');
    var nfindex = 0;
    var sex = item.item==1 ? 'F' : 'M';

    JL('client').info("Start playing audio: " + audioList[nfindex]);

    itemResponse.afilename = item.type+"."+item.item+".flac";
    itemResponse.itemType = "SubAudioResponse";

    var facePictureFiles  = item.namefacePicBlob;
    var names = item.namefaceNameBlob;
    var fourFacesDiv = document.getElementById("4faces");
    var testFaceDiv = document.getElementById("testFaceDiv");
    var testFace = document.getElementById("testFace");
    nextButton.style.display = "hidden";
    nameFacesContent.style.display = "inline";
    var namesArray = [];
    for(var p in facePictureFiles) {
        var fileN = facePictureFiles[p];
        document.getElementById("face"+p).src = nameFacesImageFolder + fileN;
        document.getElementById("name"+p).innerHTML = names[p].name;
        namesArray.push(names[p].name);
    }
    fourFacesDiv.style.display = "inline";
    testFaceDiv.style.display = "none"
    JL('client').info("Start showing faces for "+item.mtimeout+" seconds.");

    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[nfindex], function() {
        analyserImg.style.display = "none";
        startTimer(0, item.mtimeout, null, function () {
            stopTimer();
            var selectedName = item.namefaceNamePicked.name;
            //var selectedInex = names.indexOf(selectedName);
            // Show the selected name/photo ,and play audio "who is this"
            testFace.src = nameFacesImageFolder + item.namefacePicPicked.filename
            testFaceDiv.style.display = "block";
            fourFacesDiv.style.display = "none";

            playAudioGlobalAndSetOnEndFunction(audioFolder + audioList[1],
                function () {
                    analyserImg.style.display = "none";
                    JL('client').info("End playing audio: " + audioList[1] + ". Start timer and recording for interviewer to say the name.");
                    responseStartTime = subResponseStartTime = new Date();
                    gotStream(stream);
                    var proceedToNext = function (status) {
                        subResponseEndTime = new Date();
                        itemSubResponse.extraInfo = facePictureFiles.join(':') + ',' + namesArray.join(':') + ',' + selectedName;
                        itemSubResponse.status = status;
                        itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
                        itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
                        subResponseStart = itemSubResponse.start = 0;
                        itemSubResponse.duration = subResponseDuration = (subResponseEndTime - subResponseStartTime) / 1000;
                        itemSubResponse.audioFileName = item.type + "." + item.item + ".1.flac";
                        itemResponse.subresponses.push(itemSubResponse);
                        JL('client').info("End timer and recording for interviewer to say the name.");

                        stopTimer();
                        pauseRecording();

                        processSayFeelingInNameTheFace(stream, item);
                    };
                    startRecording(item.etimeout, function () {
                      //  proceedToNext("END_TIMEOUT");
                    });
                    startTimer(0, item.mtimeout,
                        null,
                        function () {
                    //        proceedToNext("MAX_TIMEOUT");
                        }
                    );
                }
            );

        })
    });
}

function processSayFeelingInNameTheFace(stream, item) {
    var sex = item.item==1 ? 'F' : 'M';
    playAudioGlobalAndSetOnEndFunction(audioFolder+item.type+"."+sex+".mp3",
        function() {
            analyserImg.style.display = "none";
            itemSubResponse = {};
            itemSubResponse.extraInfo = item.namefacePicPicked.filename + ":" + item.type + "." + sex + ".mp3"
            subResponseStartTime = new Date();

            var proceedToNext = function (status) {
                JL('client').info("End timer/recording for interviewer to say the person's feeling with status: " + status);


                itemResponse.status = itemSubResponse.status = status;
                itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
                responseEndTime = subResponseEndTime = new Date();
                itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
                itemSubResponse.start = subResponseStart = subResponseDuration + subResponseStart;
                itemSubResponse.duration = subResponseDuration = (subResponseEndTime - subResponseStartTime) / 1000;
                itemSubResponse.audioFileName = item.type + "." + item.item + ".2.flac";

                itemResponse.subresponses.push(itemSubResponse);
                itemResponse.startTime = responseStartTime.toUTCString();
                itemResponse.endTime = responseEndTime.toUTCString();

                nameFacesContent.style.display = "none";
                nextButton.style.display = "hidden";
                stopTimer();
                stopRecording(itemResponse);
                processItem(stream);
            }
            resumeRecording(item.etimeout, function () {
                nextButton.innerHTML = 'Next';
                nextButton.style.display = "inline";
                nextButton.onclick = function () {
                    proceedToNext("NEXT_TOUCHED");
                };
            });
            startTimer(item.itimeout, item.mtimeout,
                function () {
                    if (!hasUserStartedTalking()) {
                        nextButton.innerHTML = 'Speak';
                        nextButton.style.display = "inline";
                        nextButton.onclick = function () {
                            proceedToNext("NEXT_TOUCHED");
                        };
                    }
                },
                function () {
                    proceedToNext("MAX_TIMEOUT");
                }
            );
        }
    );
}