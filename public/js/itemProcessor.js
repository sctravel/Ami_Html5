var app = angular.module("itemProcessor", []);

app.service('audioProcessor',  function($rootScope) {
      this.process = function(item,scopeaudio){
          var audioFolder = "assets/Audio/items/";

          navigator.getUserMedia({audio: true, video: false}, function (stream) {
                                     //scopeaudio = processItem(stream,item,audioFolder);
                                     $rootScope.$broadcast('audio',processItem(stream,item,audioFolder));
                                }, function (error) {
                                    audioOrVideoNotEnabled("Please make sure your microphone is enabled.");
                                });

    }

    function processItem(stream,item,audioFolder) {
        console.log("#############now processing --- " + item.type + " : " + item.item);
        console.dir(item);
        switch (item.type) {
            case 2000:
                if(item.item == 1) {
                   return processVolumeChecker(stream, item,audioFolder);
                } else if(item.item == 2) {
                    processMicrophoneChecker(stream, item);
                } else {
                    processInstruction(stream, item);
                }
                break;
            case 2023:
                processDescribeSilentVideo(stream, item)
                break;
            case 2001:
            case 2041:
            case 2044:
            case 2065:
            case 2066:
            case 2067:
            case 2068:
            case 2069:
            case 2070:
            case 2071:
            case 2072:
            case 2073:
            case 2074:
            case 2100:
                if(item.item==0) processInstruction(stream, item); //item 0 has no recording
                else processAudioQuestion(stream, item);
                break;
            case 2032:
                processTrackTap(stream, item);
                //processItem(stream);
                break;
            case 2040:
                processRetellStory(stream, item);
                break;
            case 2050:
                //This type doesn't exist yet
                processStroop(stream, item);
                break;
            case 2080:
                //This type doesn't exist yet
                processInterpretResponse(stream, item);
                break;
            case 2081:
                //This type doesn't exist yet
                processFindErrorResponse(stream, item);
                break;
            case 2082:
                //This type doesn't exist yet
                processCalcuationResponse(stream, item);
                break;
            case 2062: //bypass the following two for now
                if(item.item==0) {
                    processInstruction(stream, item);
                } //item 0 has no recording
                else {//processNameTheFace(stream, item);
                    processItem(stream);
                }
                break;
            case 2064:
                //processQuickLit(stream, item);
                processItem(stream);
                break;
            default:
                processItem(stream);
                break;
        }
        /*
         if(question.type=="audio") {
         var audio = new Audio(question.source);
         console.log("playing audio with souce --- " +question.source );

         audio.onended = function() {
         console.log("playing audio ended--- " +question.source );

         canvas.style.display = "inline";
         gotStream(stream);
         toggleRecording(recordButton);
         startTimer(question.timeout, 50, function() {
         toggleRecording(recordButton);
         canvas.style.display="none";
         playQuestion(stream);
         ++index;
         })
         }
         audio.play();

         } else if(question.type=="video") {
         //video.source = question.source;
         video.style.display = "inline";
         console.log("playing video with souce --- " +question.source );
         video.src = question.source;
         video.onended = function() {
         video.style.display = "none";
         ++index;
         console.log("playing video ended--- " +question.source );
         playQuestion(stream);
         }
         video.play();

         } else if(question.type=="image") {

         } else if(question.type=="words") {

         }*/
    };
    function processInstruction(stream, item) {
        console.log("processInstruction starts with souce --- " + item.type+"."+item.item );

        var audioFileName = item.type+"."+(item.item==0 ? "mp3" : item.item+".mp3");
        var source = audioFolder + audioFileName;
        var audio = new Audio(source);
        audio.onended = function() {
            console.log("processInstruction ends --- " +source );
            instr.style.display="none";
            processItem(stream);
        }
        instr.style.display = "inline";
        audio.play();
    };
    function processTransition(stream, item) {
        var source = audioFolder + "../"+item.audio;
        var audio = new Audio(source);
        audio.onended = function() {
            processItem(stream);
        }
        audio.play();
    };

    function processAudioQuestion(stream, item) {
        console.log("processAudioQuestion starts with souce --- " + item.type+"."+item.item );

        var audioFileName = item.type+"."+item.item+".mp3";
        var source = audioFolder + audioFileName;
        var audio = new Audio(source);

        audio.onended = function() {

            analyser.style.display = "inline";
            gotStream(stream);
            startRecording();
            startTimer(item.itimeout, item.mtimeout,
                function(){
                    nextButton.style.display="inline";
                    nextButton.onclick = function() {
                        stopTimer();
                        stopRecording();
                        nextButton.style.display = "none";
                        analyser.style.display = "none";
                        processItem(stream);
                    };
                },
                function() {
                    stopTimer();
                    stopRecording();
                    nextButton.style.display = "none";
                    analyser.style.display = "none";
                    processItem(stream);
                }
            );
        }
        audio.play();
    };

    function processNameTheFace(stream, item) {

    };

    function processTrackTap(stream, item) {
        var audio = new Audio(audioFolder+item.audio);
        trackTap.style.display = "inline";
        audio.onended = function() {
            GameStart();
            startTimer(0, item.mtimeout, null, function() {
                GameOver();
                trackTap.style.display = "none";
                processItem(stream);
            });

        }
        audio.play();
    };

    function processRetellStory(stream, item){
        var audioList = item.audio.split(':');
        var rsindex = 0;
        var audio = new Audio(audioFolder+audioList[rsindex]);
        audio.onended = function() {

            playAudioInRetellStory(audioList, rsindex+1, stream, item);

        };
        audio.play();
    };
    function playAudioInRetellStory(audioList, rsindex, stream, item){
        if(rsindex>=audioList.length) {
            processItem(stream);
            return;
        }
        var audio = new Audio(audioFolder+audioList[rsindex]);

        audio.onended = function() {
            if(rsindex==2) { //The third audio in retell story is "Now you tell the story")
                analyser.style.display = "inline";
                gotStream(stream);
                startRecording();
                startTimer(item.itimeout, item.mtimeout,
                    function () {
                        nextButton.style.display = "inline";
                        nextButton.onclick = function () {
                            stopTimer();
                            stopRecording();
                            nextButton.style.display = "none";
                            analyser.style.display = "none";
                            playAudioInRetellStory(audioList, rsindex + 1, stream, item);
                        };
                    },
                    function () {
                        stopTimer();
                        stopRecording();
                        nextButton.style.display = "none";
                        analyser.style.display = "none";
                        playAudioInRetellStory(audioList, rsindex + 1, stream, item);
                    }
                );
            } else {
                playAudioInRetellStory(audioList, rsindex+1, stream, item);
            }
        }
        audio.play();
    };

    function processDescribeSilentVideo(stream, item) {
        var audioList = item.audio.split(':');
        var vindex = 0;
        video.src = videoFolder + item.video;
        video.load();
        var audio = new Audio(audioFolder+audioList[vindex]);
        audio.onended = function() {
            var analyser = document.getElementById("analyser");
            analyser.style.display="inline";
            startRecording();
            video.onended = function() {
                analyser.style.display="none";
                stopRecording();
                playAudioInDescribeVideo(audioList, vindex+1, stream, item);
            }
            video.play();
        };
        audio.play();

    };

    function playAudioInDescribeVideo(audioList, vindex, stream, item){
        if(vindex>=audioList.length) {
            processItem(stream);
            return;
        }
        var audio = new Audio(audioFolder+audioList[vindex]);

        audio.onended = function() {

            analyser.style.display = "inline";
            gotStream(stream);
            startRecording();
            startTimer(item.itimeout, item.mtimeout,
                function(){
                    nextButton.style.display="inline";
                    nextButton.onclick = function() {
                        stopTimer();
                        stopRecording();
                        nextButton.style.display = "none";
                        analyser.style.display = "none";
                        playAudioInDescribeVideo(audioList, vindex+1, stream, item);
                    };
                },
                function() {
                    stopTimer();
                    stopRecording();
                    nextButton.style.display = "none";
                    analyser.style.display = "none";
                    playAudioInDescribeVideo(audioList, vindex+1, stream, item);
                }
            );
        }
        audio.play();
    };


    function processQuickLit(stream, item) {

    };

    function processVolumeChecker(stream, item,audioFolder) {
        var audioFileName = item.type+"."+item.item+".mp3";
        var source = audioFolder + audioFileName;
        var audio = new Audio(source);
        audio.setAttribute("Loop",true);
        audio.play();
        return audio;

    };

    function processMicrophoneChecker(stream, item) {
        var audio = new Audio('/assets/Audio/items/2000.2.mp3');
        audio.onended = function() {
            document.getElementById("analyser").style.display="inline";
            gotStream(stream);
            startRecording();
            startTimer(0, item.mTimeout, null, function() {
                stopRecording();
                document.getElementById("analyser").style.display = "none";
                switch(audioLevel) {
                    case audioLevelOptions.OK:
                        var audioOK = new Audio('/assets/Audio/items/2000.2.OK.mp3');
                        audioOK.onended = function () {
                            processItem(stream);
                        }
                        audioOK.play();
                        break;
                    case audioLevelOptions.LowVolume:
                        var audioLowVolume = new Audio('/assets/Audio/items/2000.2.Low.mp3');
                        audioLowVolume.onended = function () {
                            processItem(stream);
                        }
                        audioLowVolume.play();
                        break;
                    case audioLevelOptions.LowSNR:
                        var audioLowSNR = new Audio('/assets/Audio/items/2000.2.Noise.mp3');
                        audioLowSNR.onended = function () {
                            window.location.href = "/?error=Make sure you are in a quiet place.";
                        }
                        audioLowSNR.play();
                        break;
                    default:
                        var audioUnkonw = new Audio('/assets/Audio/items/2000.2.MoreSpeech.mp3');
                        audioUnkonw.onended = function () {
                            processMicrophoneChecker(stream, item); //repeat the item again.
                        }
                        audioUnkonw.play();
                        break;
                }

            })
            //toggleRecording(this);
        };
        audio.play();
    };

    function processStroop(stream, item) {};

    function processFindErrorResponse(stream, item) {};

    function processCalcuationResponse(stream, item){};

    function processInterpretResponse() {}
});
