/**
 * Created by xitu on 2/23/2017.
 */
function processNextAudioInAudioQuestions(audioList, aindex, stream, item) {
    itemResponse.subresponses.push(itemSubResponse);
    itemSubResponse = {};
    JL("client").info("Enter processNextAudioInAudioQuestions for :"+item.type+"."+item.item+". Start Playing audio: " + audioList[aindex]);
    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[aindex], function() {
        analyserImg.style.display="none"
        subResponseStartTime = new Date();
        itemSubResponse.extraInfo='the No. '+(aindex+1) +' recording';

        JL("client").info("End Playing audio: " + audioList[aindex]+". Start Recording. ");
        var proceedToNext = function(status){
            JL("client").info("End Recording for question " + audioList[aindex] + " with status: " + status);
            stopTimer();

            subResponseEndTime = new Date();
            itemResponse.status = status;
            itemSubResponse.status = status;
            itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
            itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
            itemSubResponse.start=subResponseStart+subResponseDuration; //start equals last subresponse end;
            subResponseStart = itemSubResponse.start;
            subResponseDuration = (subResponseEndTime - subResponseStartTime)/1000;
            itemSubResponse.duration = subResponseDuration;
            itemSubResponse.audioFileName = item.type+"."+item.item+"."+(aindex+1)+".flac";

            nextButton.style.display = "none";

            if (aindex == audioList.length - 1) {
                responseEndTime=new Date();
                itemResponse.startTime = responseStartTime.toUTCString();
                itemResponse.endTime = responseEndTime.toUTCString();
                if(aindex>=1) {
                    itemResponse.subresponses.push(itemSubResponse);
                }
                stopRecording(itemResponse);
                processItem(stream);
                return;
            } else {
                pauseRecording();
                processNextAudioInAudioQuestions(audioList, aindex + 1, stream, item);
            }
        }

        resumeRecording(item.etimeout, function() {
            nextButton.innerHTML = 'Next';
            nextButton.style.display = "inline";
            nextButton.onclick = function () {
                proceedToNext("NEXT_TOUCHED");
            };
        });

        startTimer(item.itimeout, item.mtimeout,
            function () {
                if(!hasUserStartedTalking()) {
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
    });
}

function processAudioQuestion(stream, item) {
    JL("client").info("Entering  processAudioQuestion for " +item.type+"."+item.item );
    var audioFileList = item.audio.split(':');
    var aindex = 0;
    var audioFileName = audioFileList[aindex];

    itemResponse.afilename = item.type+"."+item.item+".flac";
    itemResponse.itemType = audioFileList.length >1 ? "SubAudioResponse" : "AudioResponse";
    playAudioGlobalAndSetOnEndFunction(audioFolder + audioFileName, function() {
        JL('client').info("End playing audio " + audioFileName+". Start Recording");
        analyserImg.style.display="none";
        responseStartTime = subResponseStartTime = new Date();
        itemSubResponse.extraInfo='the No. '+(aindex+1) +' recording';
        gotStream(stream);

        var proceedToNext = function(status) {
            JL('client').info("End Recording for No."+(aindex+1)+" question of " + item.type+"."+item.item +" with status: "+status);
            stopTimer();

            nextButton.style.display = "none";

            subResponseEndTime = new Date();
            itemResponse.status = status;
            itemSubResponse.status = status;
            itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
            itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
            subResponseStart = itemSubResponse.start= 0;
            subResponseDuration = (subResponseEndTime - subResponseStartTime)/1000;
            itemSubResponse.duration = subResponseDuration;
            itemSubResponse.audioFileName = item.type+"."+item.item+"."+(aindex+1)+".flac";

            if (aindex == audioFileList.length - 1) {
                responseEndTime=new Date();
                itemResponse.startTime = responseStartTime.toUTCString();
                itemResponse.endTime = responseEndTime.toUTCString();
                if(aindex>=1) {
                    itemResponse.subresponses.push(itemSubResponse);
                }
                stopRecording(itemResponse);
                processItem(stream);
                return;
            } else {
                pauseRecording();
                processNextAudioInAudioQuestions(audioFileList, aindex+1, stream, item);
            }
        };

        startRecording(item.etimeout, function(){
            nextButton.innerHTML = 'Next';
            nextButton.style.display="inline";
            nextButton.onclick = function () {
                proceedToNext("NEXT_TOUCHED");
            };
        });

        startTimer(item.itimeout, item.mtimeout,
            function(){
                if(!hasUserStartedTalking()) {
                    nextButton.innerHTML = 'Speak';
                    nextButton.style.display="inline";
                    nextButton.onclick = proceedToNext("NEXT_TOUCHED");
                }
            },
            function() {
                proceedToNext("MAX_TIMEOUT");
            }
        );
    });
}