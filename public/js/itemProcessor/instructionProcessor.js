/**
 * Created by xitu on 2/23/2017.
 */
function processInstruction(stream, item) {
    JL("client").info("Enter processInstruction for :"+item.type+", item:"+item.item);
    var audioFileName = item.type+"."+(item.item==0 ? "mp3" : item.item+".mp3");
    playAudioGlobalAndSetOnEndFunction(audioFolder + audioFileName, function() {
        instr.style.display="none";
        analyserImg.style.display="none"
        JL("client").info("Leave processInstruction for :"+item.type+", item:"+item.item);
        processItem(stream);
    });
    //instr.style.display = "inline";
}