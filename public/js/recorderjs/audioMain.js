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
var recIndex = 0;
var checkSilenceIntervalId=null;
var uploadURL = "/upload/audio/";
var isRecording = false, isAnalysing = false;
var didFuncIfSilenceAfterSpeech = false;
var snrThreshold=15, signalThreshold=30, noiseLevelPercentile=0.05, signalLevelPercentile=0.95;
var noiseLevel, signalLevel;
var latestSNR = 0;
var currentMaxAudioPoint = 0;
var audioData = [];
var audioDataStartIndex = 0;
var audioDataAverageForSeconds = [];
var currentMaxAudioInDB = 0;
var audioLevel;
var audioLevelOptions = {
    OK : 1,
    LowVolume : 2,
    LowSNR : 3,
    NoMicrophone : 4,
    UnKnown : 5
}

var blobToBase64 = function(blob, cb) {
    var reader = new FileReader();
    reader.onload = function() {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        cb(base64);
    };
    reader.readAsDataURL(blob);
};

function hasUserStartedTalking(audioData) {
    if(didFuncIfSilenceAfterSpeech) return true;
    var len = audioData.length;
    var sum = 0;
    for (var i = audioDataStartIndex; i < len; ++i) {
        sum += audioData[i];
    }
    var avg = sum/len;
    return avg >= signalThreshold ? true : false;
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
}

function stopAnalysing() {
    evaluateAudio(audioData, signalThreshold, snrThreshold);
    isAnalysing = false;
    audioData=[];
    currentMaxAudioPoint=0;
}

function doFuncIfSilenceAfterSpeech(silenceTime, funcAfterSilence) {
    if(silenceTime==0) return;
    if(!hasUserStartedTalking()) return;

    var numDataPoints = silenceTime * 6000;
    var currentLen = audioData.length;
    numDataPoints = numDataPoints > currentLen ? currentLen : numDataPoints;
    var sum = 0;
    for(var i=currentLen-1; i>=0&&i>=currentLen-numDataPoints;--i) {
        sum += audioData[i];
    }
    var avg = sum/numDataPoints;
    var isSilence =  avg >= signalThreshold ? false : true;
    if(isSilence) {
        didFuncIfSilenceAfterSpeech = true;
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
    didFuncIfSilenceAfterSpeech = false;
    startAnalysing();
    if(silenceTime>0) {
        checkSilenceIntervalId = setInterval(doFuncIfSilenceAfterSpeech,500, silenceTime, funcAfterSilence);
    }
}

function pauseRecording(){
    audioRecorder.stop();
    clearInterval(checkSilenceIntervalId);
    isRecording = false;
    stopAnalysing();
}

function resumeRecording(silenceTime, funcAfterSilence){
    audioDataStartIndex = audioData.length;
    didFuncIfSilenceAfterSpeech = false;
    audioRecorder.record();
    isRecording = true;
    startAnalysing();
    if(silenceTime>0) {
        checkSilenceIntervalId = setInterval(doFuncIfSilenceAfterSpeech,500, silenceTime, funcAfterSilence);
    }
}

function stopRecording() {
    clearInterval(checkSilenceIntervalId);
    var flac_encoder_worker = new Worker('js/recorderjs/flac/EmsWorkerProxy.js');
    console.log("stop recording")

    if (audioRecorder) {
        audioRecorder.stop();
        isRecording = false;
        stopAnalysing();
        var uploadId = item.type+"."+item.item;
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
                    console.log(" adding audio files -- " + uploadId);
                    blobToBase64(e.data.values['dummy.flac'].blob, function (base64) { // encode
                        var update = {'blob': base64, "id": uploadId};
                        $.post(postFlacUrl, update, function (data) {
                            if (data == "ok") {
                                console.log("UploadFlac succeeded");
                                //callback();
                            } else {
                                console.error("Upload flac file failed for id: " + uploadId)
                            }
                        });

                    });
                }
            }
        });
    }
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
