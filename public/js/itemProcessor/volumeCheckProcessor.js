/**
 * Created by xitu on 2/23/2017.
 */
function processVolumeChecker(stream, item) {
    JL("client").info("Entering processVolumeChecker for " +item.type+"."+item.item );

    var audioFileName = item.type+"."+item.item+".mp3";

    var source = audioFolder + audioFileName;
    audioGlobal.src = source;
    instr.innerHTML = "Hear This ?";
    var nextButton = document.getElementById("nextButton");
    nextButton.innerHTML="Next";

    audioGlobal.onended = function() {
        audioGlobal.play();
        nextButton.style.display = "inline";
        nextButton.onclick = function() {
            instr.style.display="none";
            nextButton.style.display="none";
            audioGlobal.pause();
            audioGlobal.src="";
            processItem(stream);
        };
    }
    instr.style.display = "inline";
    audioGlobal.play();
}