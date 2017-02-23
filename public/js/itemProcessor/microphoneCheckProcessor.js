/**
 * Created by xitu on 2/23/2017.
 */
function processMicrophoneChecker(stream, item) {
    var source = audioFolder + item.audio;
    JL("client").info("Entering processMicrophoneChecker for " +item.type+"."+item.item );
    instr.innerHTML="Name and Location";
    instr.style.display = "inline";

    responseStartTime = subResponseStartTime = new Date();
    itemResponse.afilename = item.type+"."+item.item+".flac";
    itemResponse.itemType = "MicrophoneAudioResponse";
    itemResponse.item = item;
    itemResponse.subresponses = [];
    itemResponse.snrDB = {};
    itemResponse.snrDB.snr_threshold = snrThreshold;
    itemResponse.snrDB.signal_threshold =signalThreshold;

    itemSubResponse = {};


    gotStream(stream);
    startRecording(0,null);
    playAudioGlobalAndSetOnEndFunction(source, function() {
        analyserImg.style.display = "none";
        JL('client').info("Start recording for microphone checker. Playing audio 2000.2.mp3.");
        pauseRecording();

        subResponseEndTime = new Date();
        itemSubResponse.extraInfo='the No. 1 recording';
        itemSubResponse.status = 'MAX_TIMEOUT';
        itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
        itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
        itemSubResponse.start=0.000; //start equals last subresponse end;
        subResponseStart = itemSubResponse.start;
        itemSubResponse.duration = subResponseDuration = (subResponseEndTime - subResponseStartTime)/1000;
        itemSubResponse.audioFileName = item.type+"."+item.item+".1.flac";

        itemResponse.subresponses.push(itemSubResponse);

        itemResponse.snrDB.signal_app = signalLevel;
        itemResponse.snrDB.noise_app = noiseLevel;
        itemResponse.snrDB.app = itemResponse.snrDB.signal_app - itemResponse.snrDB.noise_app;

        itemSubResponse = {};
        subResponseStartTime = new Date();
        itemSubResponse.extraInfo='the No. 2 recording';

        var nextButtonClicked = function() {
            stopRecording();
            stopTimer();
            JL('client').info("Stop recording for microphone checker. Playing audio 2000.2.mp3.");
            instr.style.display = "none";

            responseEndTime = subResponseEndTime = new Date();
            itemSubResponse.status = 'END_TIMEOUT';
            itemSubResponse.startTime = toUTCDateTimeString(subResponseStartTime);
            itemSubResponse.endTime = toUTCDateTimeString(subResponseEndTime);
            itemSubResponse.start= subResponseStart+subResponseDuration; //start equals last subresponse end;
            subResponseStart = itemSubResponse.start;
            itemSubResponse.duration = subResponseDuration = (subResponseEndTime - subResponseStartTime)/1000;
            itemSubResponse.audioFileName = item.type+"."+item.item+".2.flac";

            itemResponse.subresponses.push(itemSubResponse);

            itemResponse.status = "END_TIMEOUT";
            itemResponse.snrDB.signal_user = signalLevel;
            itemResponse.snrDB.noise_user = noiseLevel;
            itemResponse.snrDB.app = itemResponse.snrDB.signal_user - itemResponse.snrDB.noise_user;
            itemResponse.startTime = responseStartTime.toUTCString();
            itemResponse.endTime = responseEndTime.toUTCString();
            switch(audioLevel) {
                case audioLevelOptions.OK:
                    source = audioFolder + '2000.2.OK.mp3';
                    audioGlobal.src = source;
                    itemResponse.snrDB.level = 'OK'
                    audioGlobal.onended = function () {
                        postItemResponse(stream);
                    }
                    audioGlobal.play();
                    break;
                case audioLevelOptions.LowVolume:
                    source = audioFolder + '2000.2.Low.mp3';
                    audioGlobal.src = source;
                    itemResponse.snrDB.level = 'LowVolume'
                    audioGlobal.onended = function () {
                        postItemResponse(stream);
                    }
                    audioGlobal.play();
                    break;
                case audioLevelOptions.LowSNR:
                    source = audioFolder + '2000.2.Noise.mp3';
                    audioGlobal.src = source;
                    itemResponse.snrDB.level = 'LowSNR'
                    audioGlobal.onended = function () {
                        window.location.href = "/?error=Make sure you are in a quiet place.";
                    }
                    audioGlobal.play();
                    break;
                default:
                    source = audioFolder + '2000.2.MoreSpeech.mp3';
                    audioGlobal.src = source;
                    itemResponse.snrDB.level = 'UnKnown'
                    audioGlobal.onended = function () {
                        processMicrophoneChecker(stream, item); //repeat the item again.
                    }
                    audioGlobal.play();
                    break;
            }
        }
        resumeRecording(item.etimeout, nextButtonClicked);
        startTimer(0, item.mtimeout, null, nextButtonClicked);
    });
}