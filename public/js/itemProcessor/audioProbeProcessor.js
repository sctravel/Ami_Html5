/**
 * Created by xitu on 2/23/2017.
 */
//2066
function processAudioProbe(stream, item) {
    JL("client").info("Entering  processAudioProbe for " +item.type+"."+item.item );
    var audioList = item.audio.split(':');
    var pindex = 0;
    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[pindex],function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio " + audioList[pindex]);

        processNextAudioProbe(audioList, pindex + 1, stream, item);

    });
}

function processNextAudioProbe(audioList, pindex, stream, item) {
    JL("client").info("Entering  processAudioProbe with index" + pindex + " for " +item.type+"."+item.item );
    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[pindex],function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio " + audioList[pindex]);
        if(pindex == audioList.length-1) {
            responseStartTime = new Date();
            itemResponse.afilename = item.type+"."+item.item+".flac";
            itemResponse.itemType = "AudioResponse";
            itemResponse.item = item;
            itemResponse.subresponses=[];

            gotStream(stream);
            var proceedToNext = function(status){
                JL('client').info("End Recording in AudioProbe with status: " + status);
                responseEndTime = new Date();
                itemResponse.startTime = responseStartTime.toUTCString();
                itemResponse.endTime = responseEndTime.toUTCString();
                itemResponse.status = status;
                nextButton.style.display = "none";
                stopTimer();
                stopRecording(itemResponse);

                processItem(stream);
            }
            startRecording(item.etimeout, function(){
                nextButton.innerHTML = 'Next';
                nextButton.style.display = "inline";
                nextButton.onclick = function () {
                    proceedToNext("NEXT_TOUCHED");
                };
            });
            JL('client').info("Start Recording in AudioProbe");
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
        } else {
            processNextAudioProbe(audioList, pindex + 1, stream, item);
        }
    });
}
