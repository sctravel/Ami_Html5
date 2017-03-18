/**
 * Created by tuxi1 on 12/26/2016.
 */


window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null,
    gumStream = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var checkSilenceIntervalId=null;
var uploadURL = "/upload/audio/";
var isRecording = false, isAnalysing = false;
var didFuncIfSilenceAfterSpeech = false, userStartedTalking =false;
var snrThreshold=15, signalThreshold=30, noiseLevelPercentile=0.05, signalLevelPercentile=0.95, speakThreshold=15;
var noiseLevel, signalLevel;
var currentMaxAudioPoint = 0;
var audioData = [];
var audioDataStartIndex = 0;
var audioLevel;
var audioLevelOptions = {
    OK : 1,
    LowVolume : 2,
    LowSNR : 3,
    NoMicrophone : 4,
    UnKnown : 5
}

var audioItemResponseArray = [];
var audioUploadIndex = -1;


var blobToBase64 = function(blob, cb) {
    var reader = new FileReader();
    reader.onload = function() {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        cb(base64);
    };
    reader.readAsDataURL(blob);
};

function hasUserStartedTalking() {
    if(userStartedTalking) return true;
    var len = audioData.length;
    var startIndex = len > 10000 ? len-10000: 0;
    var sum = 0;
    for (var i = startIndex; i < len; ++i) {
        sum += audioData[i];
    }
    var avg = sum/(len-startIndex);
    //console.log("hasUserStartedTalking --- SUM: "+ sum +"; Average: " + avg +"; Threshold: " + signalThreshold);

    userStartedTalking = avg >= signalThreshold ? true : false;

    return userStartedTalking;
}

function evaluateAudio(audioData, lowSignal, minSNR) {
    if(audioData.length<10) {
        audioLevel = audioLevelOptions.UnKnown;
        return;
    }
    noiseLevel = percentile(audioData, noiseLevelPercentile);
    signalLevel = percentile(audioData, signalLevelPercentile);
    var snr = signalLevel - noiseLevel;
    console.log("noiseLevel: "+ noiseLevel+"; signalLevel: "+ signalLevel + "; snr: " + snr+ "; currentMaxAudioPoint: " +currentMaxAudioPoint);
    if(signalLevel < lowSignal) audioLevel=audioLevelOptions.LowVolume;
    else if(snr < minSNR) audioLevel=audioLevelOptions.LowSNR;
    else audioLevel=audioLevelOptions.OK;

    console.log("audioLevel after evaluation is "+audioLevel);
}

function startAnalysing() {
    audioData=[];
    currentMaxAudioPoint = 0;
    isAnalysing = true;
    analyser.style.display = "inline";
    analyserImg.style.display = "none";
}

function stopAnalysing() {
    evaluateAudio(audioData, signalThreshold, snrThreshold);
    isAnalysing = false;
    audioData=[];
    currentMaxAudioPoint=0;
    analyser.style.display = "none";
}

function doFuncIfSilenceAfterSpeech(silenceTime, funcAfterSilence) {
    if(silenceTime==0) return;
    if(!hasUserStartedTalking() || didFuncIfSilenceAfterSpeech) return;

    var numDataPoints = silenceTime * 10000;
    var currentLen = audioData.length;
    numDataPoints = numDataPoints > currentLen ? currentLen : numDataPoints;
    var sum = 0;
    for(var i=currentLen-1; i>=0&&i>=currentLen-numDataPoints;--i) {
        sum += audioData[i];
    }
    var avg = sum/numDataPoints;

    var isSilence =  avg >= speakThreshold ? false : true;
    if(isSilence) {
        didFuncIfSilenceAfterSpeech = true;
        clearInterval(checkSilenceIntervalId);
        funcAfterSilence();
    }
}

//around 6000 data point in audio data per second
function startRecording(silenceTime, funcAfterSilence) {
    console.log("Start recording");
    if (!audioRecorder)
        return;
    audioRecorder.clear();
    audioRecorder.record();
    isRecording = true;
    userStartedTalking = false;
    didFuncIfSilenceAfterSpeech = false;
    startAnalysing();
    if(silenceTime>0) {
        checkSilenceIntervalId = setInterval(doFuncIfSilenceAfterSpeech,1000, silenceTime, funcAfterSilence);
    }
}

function pauseRecording(){
    audioRecorder.stop();
    clearInterval(checkSilenceIntervalId);
    isRecording = false;
    didFuncIfSilenceAfterSpeech = false;
    userStartedTalking = false;
    stopAnalysing();
}

function resumeRecording(silenceTime, funcAfterSilence){
    audioDataStartIndex = audioData.length;
    didFuncIfSilenceAfterSpeech = false;
    userStartedTalking = false;
    audioRecorder.record();
    isRecording = true;
    startAnalysing();
    if(silenceTime>0) {
        checkSilenceIntervalId = setInterval(doFuncIfSilenceAfterSpeech,1000, silenceTime, funcAfterSilence);
    }
}

function stopRecording(itemResponse) {
    clearInterval(checkSilenceIntervalId);
    stopAnalysing();
    var flac_encoder_worker = new Worker('js/recorderjs/flac/EmsWorkerProxy.js');
    console.log("stop recording")
    userStartedTalking = false;
    didFuncIfSilenceAfterSpeech = false;
    if (audioRecorder) {
        audioRecorder.stop();
        isRecording = false;
        audioItemResponseArray.push(itemResponse);
        audioRecorder.getData(function(s) {
            // convert wav to flac
            var args = [ 'dummy.wav' ];
            var inData = {};
            inData['dummy.wav'] = new Uint8Array(s);
            var outData = {};
            outData['dummy.flac'] = { 'MIME': 'audio/flac' };
            flac_encoder_worker.postMessage({ command: 'encode', args: args, outData: outData, fileData: inData });
            //navigator.getUserMedia({audio: true}, gotStream, function(e) { console.log('No live audio input: ' + e); });

            // Listen for messages by the flac_encoder_worker
            flac_encoder_worker.onmessage = function(e) {
                if (e.data && e.data.reply === 'done') {

                    blobToBase64(e.data.values['dummy.flac'].blob, function (base64) { // encode
                        ++audioUploadIndex;
                        var currentItemResponse = audioItemResponseArray[audioUploadIndex];
                        var uploadId = currentItemResponse.item.type+"."+currentItemResponse.item.item;
                        console.log(" adding audio files -- " + uploadId);
                        var update = {'blob': base64, "id": uploadId};
                        var date = new Date();
                        var file = new File([base64], 'amipace/'+sessionId+'/'+uploadId+'.flac', {
                            lastModified: new Date(0), // optional - default = now
                            type: "overide/mimetype" // optional - default = ''
                        });
                     //   console.log(" adding audio files -- " + uploadId);

                        $.get( "/getPresignedURL", { fileName: file.name, type: file.type}, function( dataURL ) {
                           var  tryCount = 0;
                            $.ajax({
                                type : 'PUT',
                                url : dataURL,
                                data : file,
                                processData: false,  // tell jQuery not to convert to form data
                                contentType: file.type,

                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    console.log(tryCount);
                                    tryCount ++;
                                      if(tryCount == 3){
                                          alert('Opps, uploading audio failed! Refreshing the page and try it again. Thank you for your patient.');
                                          window.location.href = '/interview';
                                      }
                                }
                            }).retry({times:3, timeout:20000}).then(function(json){
                                postItemResponse(currentItemResponse);
                            });

                        });
                        /*
                        $.post(postFlacUrl, update, function (data) {
                            if (data == "ok") {
                                console.log("UploadFlac succeeded");
                                //callback();
                            } else {
                                console.error("Upload flac file failed for id: " + uploadId)
                            }
                        });*/

                    });
                }
            }
        });
    }
}

function postItemResponse(itemResponse) {
    console.log("start postItemResponse");
    $.post("/api/session/updateSessionState", {itemResponse : itemResponse}, function(data) {
        if(data!="ok") {
            var errorMessage = "Upload response for testItem type:"+itemResponse.item.type+", item:"+itemResponse.item.item + " failed with message: " + data;
            console.error(errorMessage);
            JL("client").error(errorMessage);
            alert('Opps, uploading audio response failed! Refreshing the page and try it again. Thank you for your patient.');
            window.location.href = '/interview';
        } else {
            JL("client").error("Upload response for testItem type:"+itemResponse.item.type+", item:"+itemResponse.item.item + " succeeded.");
        }
    })
}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    if(isAnalysing)
    {
        var SPACING = 3;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
        //var freqFloatData = new Float32Array(analyserNode.frequencyBinCount); // Float32Array should be the same length as the frequencyBinCount
        //analyserNode.getFloatFrequencyData(freqFloatData); // fill the Float32Array with data returned from getFloatFrequencyData()
        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            audioData.push(magnitude);
            if(currentMaxAudioPoint<magnitude) currentMaxAudioPoint = magnitude;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    console.log("GOT Stream!");
    gumStream = stream;
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}

function percentile(arr, p) {
    if (arr.length === 0) return 0;
    if (typeof p !== 'number') throw new TypeError('p must be a number');
    if (p <= 0) return arr[0];
    if (p >= 1) return arr[arr.length - 1];

    arr.sort(function (a, b) { return a - b; });
    var index = (arr.length - 1) * p
    lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
}
