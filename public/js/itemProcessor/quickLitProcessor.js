/**
 * Created by xitu on 2/23/2017.
 */
function processQuickLit(stream, item) {
    JL("client").info("Entering processQuickLit for " +item.type+"."+item.item );

    var audioList = item.audio.split(':'); // length==2
    var wordsBlob = item.wordsBlob;
    var numWords = wordsBlob.length;

    responseStartTime = subResponseStartTime = new Date();
    itemResponse.afilename = item.type+"."+item.item+".flac";
    itemResponse.itemType = "QuickLitResponse";
    itemResponse.item = item;
    itemResponse.words = [];
    var intervalId = null;
    playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[0],function() {
        analyserImg.style.display = "none";
        JL('client').info("End playing audio " + audioList[0]);
        //show the word one by one
        var showWord = function() {
            //if(numWords!=wordsBlob.length) stopTimer();
            console.log("numWords: "+numWords);
            --numWords;

            if(numWords<0) {
                JL('client').info("Start tapping all real words in QuickLit at time：" + (new Date()-responseStartTime)/1000);
                instr.style.display = "none";
                var textShowAll =document.getElementById("textShowAll");
                textShowAll.style.display="inline";
                for(var i =0; i <wordsBlob.length; i++ ){
                    var word_slot =  document.getElementById("word" + i);
                    word_slot.innerHTML= wordsBlob[i].string;
                }
                //stopTimer();
                clearInterval(intervalId);
                stopRecording();
                playAudioGlobalAndSetOnEndFunction(audioFolder+audioList[1],function() {
                    analyserImg.style.display = "none";
                    var proceedToNext = function(status){
                        nextButton.style.display = "none";
                        itemResponse.status = status;
                        stopTimer();
                        for (var wordDiv of selectedWords) {
                            //sessionId, testId, type, item, word, isWord, isUsed, level, duration, isTouched, touchTimeStamp, wordIndex, isCorrect
                            document.getElementById(wordDiv).classList.remove('highlight');
                            var sWord = document.getElementById(wordDiv).innerHTML;
                            var index = parseInt(wordDiv[wordDiv.length-1]);
                            var sWordResponse = itemResponse.words[index];
                            sWordResponse.isTouched = 'Y';
                            sWordResponse.isCorrect = sWordResponse.isWord=='Y' ? 'Y' : 'N';
                            sWordResponse.touchTimeStamp = wordTouchMap[wordDiv].toUTCString();
                        }
                        var textShowAll = document.getElementById("textShowAll");
                        textShowAll.style.display = "none";
                        //remember to touch time and isCorrect
                        selectedWords = new Set();
                        var touchScore = 0;
                        itemResponse.words.forEach(function(it){
                            if(it.isTouched=='Y' && it.isWord=='Y') ++touchScore;
                            else if(it.isTouched=='N' && it.isWord=='Y') --touchScore;
                            else if(it.isTouched=='Y' && it.isWord=='N') --touchScore;
                        })

                        responseEndTime=new Date();
                        itemResponse.startTime = responseStartTime.toUTCString();
                        itemResponse.endTime = responseEndTime.toUTCString();
                        itemResponse.score = touchScore;
                        JL('client').info("End tapping all real words in QuickLit.");
                        postItemResponse(stream);
                    }
                    nextButton.style.display = "inline";
                    nextButton.onclick = function () {
                        proceedToNext("NEXT_TOUCHED")
                    }
                    startTimer(0, wordsBlob.length*item.mtimeout, null, function(){
                        proceedToNext("MAX_TIMEOUT");
                    })
                });
            } else {
                JL('client').info("Showing word " + (wordsBlob.length-numWords) + " at time：" + (new Date()-responseStartTime)/1000);

                var wordBlob = wordsBlob[wordsBlob.length-numWords-1];
                var wordShown = wordBlob.string;
                instr.innerHTML = wordShown;

                var wordResponse = {};
                //word, isWord, isUsed, level, duration, isTouched, touchTimeStamp, wordIndex, isCorrect
                wordResponse.word = wordBlob.string;
                wordResponse.isWord = wordBlob.word;
                wordResponse.isUsed = wordBlob.used;
                wordResponse.level = wordBlob.level;
                wordResponse.duration = 3.00;
                wordResponse.wordIndex = wordsBlob.length-numWords-1;
                wordResponse.isTouched = 'N';
                wordResponse.touchTimeStamp = null;
                wordResponse.isCorrect = wordResponse.isWord=='N' ? 'Y' : 'N';
                itemResponse.words.push(wordResponse);

                JL('client').info("Start showing word: "+wordShown);
                instr.style.display = "inline";
                //startTimer(0, item.mtimeout, null, showWord);
            }

        }
        JL('client').info("Showing word at interval: " + item.mtimeout);
        showWord();
        intervalId = setInterval(showWord, item.mtimeout*1000);
        //showWord();
        gotStream(stream);
        startRecording(0, null);
        JL('client').info("Start recording during word show in QuickLit.");
        //startTimer(0, item.mtimeout, null, showWord);
    });

}

var toggleHighlight = function(div) {
    var key = div.id;
    if(div.classList.contains('highlight')) {
        div.classList.remove('highlight');
        wordTouchMap[key] = null;
        selectedWords.delete(div.id);
    } else {
        div.classList.add('highlight');
        selectedWords.add(div.id);
        wordTouchMap[key] = new Date();
    }
}