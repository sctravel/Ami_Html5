

function snapshot() {
    var canvas = document.querySelector('snapshot');
    var ctx = canvas.getContext('2d');
    var image = document.querySelector('img');
    var cw = camera.clientWidth;
    var ch = camera.clientHeight;
    ctx.drawImage(camera, 0, 0, cw, ch, 0, 0, cw / 2, ch / 3);
    image.src = canvas.toDataURL();
    image.height = ch;
    image.width = cw;
}


function audioOrVideoNotEnabled(text) {
    audioLevel = audioLevelOptions.NoMicrophone;
    alert(text);
    var audio = new Audio('/assets/Audio/EnableInterviewAccess.mp3');
    audio.play();
    audio.onended = function() {
        window.location.href= '/?error='+text
    };
}

function startCamera() {
    var camera = document.getElementById('camera');
//camera.addEventListener('click', snapshot, false);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: false},
            function (stream) {
                camera.src = window.URL.createObjectURL(stream);
                camera.onloadedmetadata = function (e) {
                    camera.play();
                };
            },
            function (err) {
                audioOrVideoNotEnabled("Please make sure you have camera enabled on your device!");
            }
        );
    } else {
        audioOrVideoNotEnabled("Your Browser doesn't support video");
    }
}