/**
 * Created by tuxi1 on 12/26/2016.
 */


window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;
var uploadURL = "/upload/audio/";
var isRecording = false, isAnalysing = false;

var snrThreshold=15, signalThreshold=30, noiseLevelPercentile=0.05, signalLevelPercentile=0.95;
var noiseLevel, signalLevel;
var latestSNR = 0;
var currentMaxAudioPoint = 0;
var audioData = [];
var currentMaxAudioInDB = 0;
var audioLevel;
var audioLevelOptions = {
    OK : 1,
    LowVolume : 2,
    LowSNR : 3,
    NoMicrophone : 4,
    UnKnown : 5
}

/* TODO:

 - offer mono option
 - "Monitor input" switch
 */

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

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
    //var canvas = document.getElementById( "wavedisplay" );

    //drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding( blob ) {
    //Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    Recorder.startUpload( blob, uploadURL );
    recIndex++;
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

function startRecording() {
    if (!audioRecorder)
        return;
    audioRecorder.clear();
    audioRecorder.record();
    isRecording = true;
    startAnalysing();

}
function stopRecording() {
    console.log("stop recording")
    audioRecorder.stop();
    isRecording = false;
    audioRecorder.getData( gotBuffers );
    stopAnalysing();
}

function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        // stop recording
        e.classList.remove("recording");
        stopRecording();
    } else {
        // start recording
        startRecording();
        e.classList.add("recording");
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
        var freqFloatData = new Float32Array(analyserNode.frequencyBinCount); // Float32Array should be the same length as the frequencyBinCount
        analyserNode.getFloatFrequencyData(freqFloatData); // fill the Float32Array with data returned from getFloatFrequencyData()
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
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

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

function initAudio() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
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

window.addEventListener('load', initAudio );