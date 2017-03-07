/**
 * Created by xitu on 2/23/2017.
 */


function processTrackTap(stream, item) {
    JL("client").info("Entering  processTrackTap for " +item.type+"."+item.item );

    itemResponse.afilename = "";
    itemResponse.itemType = "TrackTapResponse";
    itemResponse.item = item;

    nextButton.style.display = 'none';
    trackTap.style.display = "inline";
    playAudioGlobalAndSetOnEndFunction(audioFolder+item.audio, function() {
        analyserImg.style.display = "none";
        JL('client').info("Start playing tracktap");
        responseStartTime = new Date();
        itemResponse.taps=[];
        GameStart(20);
        startTimer(0, item.mtimeout, null, function() {
            GameOver();
            JL('client').info("End playing tracktap");
            trackTap.style.display = "none";
            responseEndTime = new Date();
            itemResponse.startTime = responseStartTime.toUTCString();
            itemResponse.endTime = responseEndTime.toUTCString();
            itemResponse.status = "MAX_TIMEOUT";
            itemResponse.score = score;
            itemResponse.latency = 0; //"dummy" for now
            //itemResponse.scoreInfo = scoreInfo;
            postItemResponse(itemResponse);
            processItem(stream)
        });
    });
}
