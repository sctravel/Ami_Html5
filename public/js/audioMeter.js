/**
 * Created by tuxi1 on 1/7/2017.
 */
window.onload=function(){
    var canvas = document.querySelector('#meter');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    //create the audio context
    var audio = new (window.AudioContext||window.webkitAudioContext)();
    var source = audio.createBufferSource();
    var analyser = audio.createScriptProcessor(1024,1,1);

    //fill the canvas first
    ctx.fillStyle = '#555';
    ctx.fillRect(0,0,w,h);

    //add the drop event handlers
    document.addEventListener('dragover',function(e){
        e.preventDefault();
    });
    document.addEventListener('drop',function(e){
        e.preventDefault();
        //create the file reader to read the audio file dropped
        var reader = new FileReader();
        reader.onload = function(e){
            if(audio.decodeAudioData){
                //decode the audio data
                audio.decodeAudioData(e.target.result,function(buffer){
                    source.buffer = buffer;
                });
            } else {
                //fallback to the old API
                source.buffer = audio.createBuffer(e.target.result,true);
            }
            //connect to the destination and our analyser
            source.connect(audio.destination);
            source.connect(analyser);
            analyser.connect(audio.destination);
            //play the song
            source.noteOn(0);
        }
        //read the file
        reader.readAsArrayBuffer(e.dataTransfer.files[0]);
    });
    //program our analyser
    analyser.onaudioprocess = function(e){
        var out = e.outputBuffer.getChannelData(0);
        var int = e.inputBuffer.getChannelData(0);
        var max = 0;

        for(var i = 0; i < int.length; i++){
            out[i] = 0;//prevent feedback and we only need the input data
            max = int[i] > max ? int[i] : max;
        }
        //convert from magitude to decibel
        var db = 20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;
        //It's time to draw on the canvas
        //create the gradient
        var grad = ctx.createLinearGradient(w/10,h*0.2,w/10,h*0.95);
        grad.addColorStop(0,'red');
        grad.addColorStop(-6/-72,'yellow');
        grad.addColorStop(1,'green');
        //fill the background
        ctx.fillStyle = '#555';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = grad;
        //draw the rectangle
        ctx.fillRect(w/10,h*0.8*(db/-72),w*8/10,(h*0.95)-h*0.8*(db/-72));
        //draw the text out
        ctx.fillStyle="white";
        ctx.font = "Arial 12pt";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(db*100)/100+' dB',w/2,h-h*0.025);
    };
    //Now try to drag some audio files to the preview area
    //it'll show a nice audio meter
}