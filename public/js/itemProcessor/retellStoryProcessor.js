/**
 * Created by xitu on 2/23/2017.
 */
function processRetellStory(stream, item){
    JL("client").info("Entering  processRetellStory for " +item.type+"."+item.item );
    var audioList = item.audio.split(':');
    var rsindex = 0;
    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[rsindex],function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio " + audioList[rsindex]);
        playAudioInRetellStory(audioList, rsindex+1, stream, item);
    });
}

function playAudioInRetellStory(audioList, rsindex, stream, item){
    if(rsindex>=audioList.length) {
        processItem(stream);
        return;
    }
    JL("client").info("Entering  playAudioInRetellStory for " +item.type+"."+item.item );

    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[rsindex],function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio " + audioList[rsindex]);
        if(rsindex==2) { //The third audio in retell story is "Now you tell the story")

            responseStartTime = new Date();
            itemResponse.afilename = item.type+"."+item.item+".flac";
            itemResponse.itemType = "AudioResponse";
            itemResponse.item = item;
            itemResponse.subresponses=[];

            gotStream(stream);
            var proceedToNext = function(status){
                JL('client').info("End Recording in RetellStory with status: " + status);
                responseEndTime = new Date();
                itemResponse.startTime = responseStartTime.toUTCString();
                itemResponse.endTime = responseEndTime.toUTCString();
                itemResponse.status = status;
                nextButton.style.display = "hidden";

                stopTimer();
                stopRecording(itemResponse);

                playAudioInRetellStory(audioList, rsindex + 1, stream, item);
            }
            startRecording(item.etimeout, function(){
                nextButton.innerHTML = 'Next';
                nextButton.style.display = "inline";
                nextButton.onclick = function () {
                    proceedToNext("NEXT_TOUCHED");
                };
            });
            JL('client').info("Start Recording in RetellStory");
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
            playAudioInRetellStory(audioList, rsindex+1, stream, item);
        }
    });
}
