/**
 * Created by xitu on 2/23/2017.
 */
function processDescribeSilentVideo(stream, item) {
    JL("client").info("Entering  processDescribeSilentVideo for " +item.type+"."+item.item );

    var audioList = item.audio.split(':');
    var vindex = 0;
    videoContent.style.display="inline";

    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[vindex], function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio " + audioList[vindex]);

        responseStartTime = subResponseStartTime = new Date();
        itemResponse.afilename = item.type+"."+item.item+".flac";
        itemResponse.itemType = "SubAudioResponse";
        itemResponse.item = item;
        itemResponse.subresponses=[];

        itemSubResponse.extraInfo='the No. '+(vindex+1) +' recording';

        gotStream(stream);
        startRecording(0,null);
        JL('client').info("Start playing video " + item.video+" and recording.");
        var videoTimeout = video.duration + item.mtimeout;
        video.play();
        startTimer(0, videoTimeout, null, function() { //video.onend ?
            JL('client').info("End playing video " + item.video+" and recording.");
            stopTimer();
            pauseRecording();

            subResponseEndTime = new Date();
            itemSubResponse.status = "MAX_TIMEOUT";
            itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
            itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
            subResponseStart = itemSubResponse.start= 0;
            subResponseDuration = (subResponseEndTime - subResponseStartTime)/1000;
            itemSubResponse.duration = subResponseDuration;
            itemSubResponse.audioFileName = item.type+"."+item.item+"."+(vindex+1)+".flac";

            playAudioInDescribeVideo(audioList, vindex+1, stream, item);
        })

    });
}

function playAudioInDescribeVideo(audioList, vindex, stream, item){

    JL("client").info("Entering playAudioInDescribeVideo for " +item.type+"."+item.item );

    itemResponse.subresponses.push(itemSubResponse);
    itemSubResponse={};

    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[vindex],function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio and start recording for " + audioList[vindex]);

        subResponseStartTime = new Date();
        var proceedToNext = function(status){
            JL('client').info("End recording for " + audioList[vindex]+". Next button touched.");

            subResponseEndTime = new Date();
            itemSubResponse.extraInfo='the No. '+(vindex+1) +' recording';
            itemSubResponse.status = status;
            itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
            itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
            itemSubResponse.start=subResponseStart+subResponseDuration; //start equals last subresponse end;
            subResponseStart = itemSubResponse.start;
            subResponseDuration = (subResponseEndTime - subResponseStartTime)/1000;
            itemSubResponse.duration = subResponseDuration;
            itemSubResponse.audioFileName = item.type+"."+item.item+"."+(vindex+1)+".flac";
            nextButton.style.display = "hidden";

            stopTimer();
            if(vindex==audioList.length-1) {
                videoContent.style.display="none";

                itemResponse.status = "MAX_TIMEOUT";
                responseEndTime=new Date();
                itemResponse.startTime = responseStartTime.toUTCString();
                itemResponse.endTime = responseEndTime.toUTCString();
                stopRecording(itemResponse);
                processItem(stream);
                return;
            } else {
                playAudioInDescribeVideo(audioList, vindex+1, stream, item);
                pauseRecording();
            }
        }

        resumeRecording(item.etimeout, function(){
            nextButton.innerHTML = 'Next';
            nextButton.style.display="inline";
            nextButton.onclick = function() {
                proceedToNext("NEXT_TOUCHED");
            };
        });
        startTimer(item.itimeout, item.mtimeout,
            function(){
                if(!hasUserStartedTalking())  {
                    nextButton.innerHTML = 'Speak';
                    nextButton.style.display="inline";
                    nextButton.onclick = function() {
                        proceedToNext("NEXT_TOUCHED");
                    };
                }
            },
            function() {
                proceedToNext("MAX_TIMEOUT");
            }
        );
    });
}
